const express = require("express");
const { getAccessToken } = require("../services/pesapal");

const router = express.Router();

router.get("/test-token", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
