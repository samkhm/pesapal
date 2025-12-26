import { useState } from "react";
import api from "../../services/api";
import "./form.css";

const Form = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Normalize phone number to 2547XXXXXXXX
  const normalizePhone = (input) => {
    let value = input.replace(/\s+/g, "");

    if (value.startsWith("+254")) {
      value = value.substring(1);
    }

    if (value.startsWith("07")) {
      value = "254" + value.substring(1);
    }

    if (value.startsWith("7") && value.length === 9) {
      value = "254" + value;
    }

    return value;
  };

  const isValidPhone = (phone) => /^2547\d{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const normalizedPhone = normalizePhone(phone);

    if (!isValidPhone(normalizedPhone)) {
      setError("Enter a valid Kenyan mobile number");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      setError("Amount must be at least 1");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/pay", {
        name: name.trim(),
        phone: normalizedPhone,
        amount: numericAmount
      });

      window.location.href = response.data.redirectUrl;

    } catch (err) {
      console.error(err);
      setError("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Make a Payment</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number (e.g. 0712345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="1"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Form;
