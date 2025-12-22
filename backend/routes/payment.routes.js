const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");
const { getAccessToken, createOrder, verifyTransaction } = require("../services/pesapal");

const router = express.Router();

/**
 * POST /api/pay
 * Create a Pesapal order and return checkout URL
 */
router.post("/pay", async (req, res) => {
  const { name, phone } = req.body;
  console.log(name, phone)

  try {
    // Step 1: Get Pesapal access token
    const token = await getAccessToken();

    console.log("token", token)
    // Step 2: Generate unique order ID
    const orderId = uuidv4();

    // Step 3: Build order object
    const order = {
      id: orderId,
      currency: "KES",
      amount: 1, // Replace with actual amount
      description: "Test Payment",
      callback_url: `${process.env.BASE_URL}/api/callback`, // redirect after payment
      notification_id: process.env.PESAPAL_IPN_ID,          // IPN identifier
      billing_address: {
        phone_number: phone,
        first_name: name
      }
    };

    // Step 4: Submit order to Pesapal
    const pesapalResponse = await createOrder(token, order);

    // Step 5: Save initial transaction in DB
    await Payment.create({
      name,
      phone,
      transactionId: orderId,
      status: "PENDING"
    });

    // Step 6: Return Pesapal checkout URL to frontend
    res.json({ redirectUrl: pesapalResponse.redirect_url });

  } catch (err) {
    console.error("Error creating Pesapal order:", err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});


/**
 * GET /api/callback
 * Pesapal IPN callback to verify and update transaction status
 */
router.get("/callback", async (req, res) => {
  const { OrderTrackingId, OrderMerchantReference } = req.query;

  if (!OrderMerchantReference) {
    return res.status(400).send("Missing reference");
  }

  try {
    // Step 1: Get Pesapal access token
    const token = await getAccessToken();

    // Step 2: Verify transaction status with Pesapal
    const result = await verifyTransaction(token, OrderTrackingId);

    // Step 3: Map Pesapal status to DB
    let status = "PENDING";
    if (result.status === "COMPLETED") status = "COMPLETED";
    else if (result.status === "FAILED") status = "FAILED";
    else if (result.status === "CANCELLED") status = "CANCELLED";

    // Step 4: Update transaction in DB
    await Payment.findOneAndUpdate(
      { transactionId: OrderMerchantReference },
      {
        status,
        pesapalTrackingId: OrderTrackingId,
        updatedAt: new Date()
      }
    );

    // Step 5: Respond 200 OK to Pesapal
    res.status(200).send("OK");

  } catch (err) {
    console.error("Error verifying payment:", err.message);
    // Respond 200 OK even on error to prevent endless retries
    res.status(200).send("OK");
  }
});

module.exports = router;
