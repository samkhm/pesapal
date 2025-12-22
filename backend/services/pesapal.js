const axios = require("axios");

const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL;
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;

async function getAccessToken() {
  try {
    const response = await axios.post(
      `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
      null, // no body needed
      {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Token response:", response.data);
    return response.data;
    // return response.data?.token;
  } catch (err) {
    if (err.response) {
      console.error("Pesapal token error:", err.response.data);
    } else {
      console.error("Pesapal token request failed:", err.message);
    }
    return null;
  }
}

// Submit order
async function createOrder(token, order) {
  try {
    const response = await axios.post(
      `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      order,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Pesapal order response:", response.data);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Pesapal create order error:", err.response.data);
    } else {
      console.error("Pesapal create order request failed:", err.message);
    }
    throw err;
  }
}

// Verify transaction status
async function verifyTransaction(token, trackingId) {
  try {
    const response = await axios.get(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus/${trackingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Pesapal verify transaction error:", err.response.data);
    } else {
      console.error("Pesapal verify transaction request failed:", err.message);
    }
    throw err;
  }
}

// Export all functions
module.exports = { getAccessToken, createOrder, verifyTransaction };
