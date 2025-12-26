require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

 


app.use("/api", paymentRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on portt http://localhost:${PORT}`);
});
