const axios = require("axios");

const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL;
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;

// Get Pesapal access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
      { consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.token;
  } catch (err) {
    console.error("Pesapal token error:", err.response?.data || err.message);
    return null;
  }
}

// Submit Pesapal order
async function createOrder(token, order) {
  try {
    const response = await axios.post(
      `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      order,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    console.error("Pesapal create order error:", err.response?.data || err.message);
    throw err;
  }
}

// Verify transaction (sandbox: POST to GetTransactionStatus)
async function verifyTransaction(token, trackingId) {
  try {
    const response = await axios.post(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus`,
      { orderTrackingId: trackingId },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    console.error("Pesapal verify transaction error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { getAccessToken, createOrder, verifyTransaction };
