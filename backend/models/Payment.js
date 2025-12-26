const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  amount: Number,
  transactionId: { type: String, unique: true },
  pesapalTrackingId: String,
  status: String,
  rawResponse: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});


module.exports = mongoose.model("Payment", paymentSchema);
