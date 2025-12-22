import { useState } from "react";
import api from "../../services/api";
import "./form.css";

function PaymentForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/pay", { name, phone });
    window.location.href = res.data.redirectUrl;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Make Payment</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <button type="submit">Pay Now</button>
    </form>
  );
}

export default PaymentForm;
