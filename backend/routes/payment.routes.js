const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");
const { getAccessToken, createOrder, verifyTransaction } = require("../services/pesapal");

const router = express.Router();


router.post("/pay", async (req, res) => {
  let { name, phone, amount } = req.body;

  if (!name || !phone || !amount) {
    return res.status(400).json({ error: "Name, phone, and amount are required" });
  }

  // Normalize phone to 2547XXXXXXXX
  phone = phone.replace(/\s+/g, "");
  if (phone.startsWith("+254")) phone = phone.substring(1);
  if (phone.startsWith("07")) phone = "254" + phone.substring(1);
  if (phone.startsWith("7") && phone.length === 9) phone = "254" + phone;

  if (!/^2547\d{8}$/.test(phone)) {
    return res.status(400).json({ error: "Invalid Kenyan phone number" });
  }

  amount = Number(amount);
  if (isNaN(amount) || amount < 1) {
    return res.status(400).json({ error: "Amount must be at least 1 KES" });
  }

  try {
    const token = await getAccessToken();
    if (!token) return res.status(500).json({ error: "Unable to obtain access token" });

    const orderId = uuidv4();

    const order = {
      id: orderId,
      currency: "KES",
      amount,
      description: "AIC KIU YOUTH",
      callback_url: `${process.env.BASE_URL}/api/callback`,
      redirect_mode: "TOP_WINDOW",
      notification_id: process.env.PESAPAL_IPN_ID,
      branch: "My Store - HQ",
      billing_address: {
        phone_number: phone,
        first_name: name,
        country_code: "KE",
        line_1: "My Company"
      }
    };

    const pesapalResponse = await createOrder(token, order);

    // Save to DB
    const saved = await Payment.create({
      name,
      phone,
      amount,
      transactionId: orderId,
      status: "PENDING"
    });

    res.json({ redirectUrl: pesapalResponse.redirect_url, rawResponse: pesapalResponse });
  } catch (err) {
    console.error("Error creating Pesapal order:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed", details: err.response?.data || err.message });
  }
});





// Handle browser redirect (GET)
// router.get("/callback", async (req, res) => {
//   const { OrderTrackingId, OrderMerchantReference } = req.query;

//   console.log("Redirect callback (GET):", req.query);

//   if (!OrderTrackingId || !OrderMerchantReference) {
//     return res.status(400).send("Missing payment reference");
//   }

//   // You can show a simple confirmation page or redirect frontend
//   return res.redirect(
//     `${process.env.FRONTEND_URL}/payment-status?ref=${OrderMerchantReference}`
//   );
// });

// Handle IPN notification (POST)





router.all("/callback", async (req, res) => {
  const data = req.body?.OrderTrackingId ? req.body : req.query;

  const {
    OrderTrackingId,
    OrderMerchantReference
  } = data || {};

  // Always acknowledge Pesapal if missing data
  if (!OrderTrackingId || !OrderMerchantReference) {
    return res.status(200).send("OK Done");
  }

  try {
    const token = await getAccessToken();
    if (token) {
      const response = await axios.post(
        `${process.env.PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus`,
        { orderTrackingId: OrderTrackingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const desc = response.data.payment_status_description;

      let status = "PENDING";
      if (desc === "Completed") status = "COMPLETED";
      if (desc === "Failed") status = "FAILED";
      if (desc === "Cancelled") status = "CANCELLED";

  const updatedIs =  await Payment.findOneAndUpdate(
        { transactionId: OrderMerchantReference },
        {
          status,
          pesapalTrackingId: OrderTrackingId,
          updatedAt: new Date()
        }
      );

      console.log("Updted data: ", updatedIs)
    }

    /**
     * 🔑 IMPORTANT PART
     * If this request came from a browser, redirect
     */
    const acceptsHtml =
      req.headers.accept && req.headers.accept.includes("text/html");

    if (acceptsHtml) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-status?ref=${OrderMerchantReference}`
      );
    }

    // Otherwise IPN
    return res.status(200).send("OK");

  } catch (err) {
    console.error("Callback error:", err.response?.data || err.message);
    return res.status(200).send("OK");
  }
});







module.exports = router;
