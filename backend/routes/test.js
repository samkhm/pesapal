const express = require("express");
const { getAccessToken } = require("../services/pesapal");

const router = express.Router();

/**
 * GET /api/test-token
 * Returns the full response from Pesapal when requesting a token
 */
router.get("/test-token", async (req, res) => {
  try {
    // Get full response from Pesapal
    const tokenResponse = await getAccessToken(true); // pass a flag to return full response
    res.status(200).json(tokenResponse);
  } catch (err) {
    console.error("Error fetching Pesapal token:", err.response || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
