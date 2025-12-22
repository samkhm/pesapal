const express = require("express");
const { getAccessToken } = require("../services/pesapal");

const router = express.Router();

router.get("/test-token", async (req, res) => {
  try {
    // Call Pesapal
    const tokenResponse = await getAccessToken(true); // pass a flag if needed
    // Return the full response
    res.json(tokenResponse);
  } catch (err) {
    console.error("Error fetching token:", err.response || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
