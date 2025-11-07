import { useState, useEffect } from "react";
import './App.css';
import { createPayment, getPayments } from "./api";

function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [recipient, setRecipient] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setToken(data.token);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments
  const fetchPayments = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPayments(token);
      setPayments(data);
    } catch (err) {
      setError(err.message || "Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  // Submit payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!token || !amount || !currency || !recipient) {
      setError("Please fill in all payment fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await createPayment(token, { amount, currency, recipient });
      alert(data.message || "Payment submitted successfully!");
      setAmount("");
      setCurrency("USD");
      setRecipient("");
      fetchPayments();
    } catch (err) {
      setError(err.message || "Error creating payment");
    } finally {
      setLoading(false);
    }
  };

  // Fetch payments automatically after login
  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>💳 Secure Payments Portal</h1>

        {!token ? (
          <form onSubmit={handleLogin} style={{ marginBottom: 20 }}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><br />
            <button type="submit" disabled={loading}>Login</button>
          </form>
        ) : (
          <div>
            <p>✅ Logged in. Token active.</p>

            <form onSubmit={handlePayment} style={{ marginBottom: 20 }}>
              <h2>Create Payment</h2>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              /><br />
              <input
                type="text"
                placeholder="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              /><br />
              <input
                type="text"
                placeholder="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              /><br />
              <button type="submit" disabled={loading}>Submit Payment</button>
            </form>

            <button onClick={fetchPayments} disabled={loading}>
              Refresh Payments
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Payments List</h2>
            {payments.length > 0 ? (
              <ul>
                {payments.map((p) => (
                  <li key={p.id}>
                    ID: {p.id}, Amount: {p.amount} {p.currency}, Recipient: {p.recipient}, Status: {p.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No payments found.</p>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
