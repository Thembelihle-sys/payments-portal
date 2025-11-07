
import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { getPayments } from "./api"; // Correct import

function App() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(""); // JWT token input

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPayments(token);
        // Sanitize backend data
        const safePayments = data.map(p => ({
          id: String(p.id),
          amount: Number(p.amount),
          currency: String(p.currency || "USD"),
          recipient: String(p.recipient || "N/A"),
          status: String(p.status || "Pending"),
        }));
        setPayments(safePayments);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Unable to fetch payments. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Payments Portal (Secure Version)</h1>
        <p>Backend API: {apiUrl}</p>

        <div style={{ marginBottom: 20 }}>
          <label>Enter JWT Token:</label><br />
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <h2>Payments List</h2>
        {loading && <p>Loading payments...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          payments.length > 0 ? (
            <ul>
              {payments.map((p) => (
                <li key={p.id}>
                  ID: {p.id}, Amount: {p.amount} {p.currency}, Recipient: {p.recipient}, Status: {p.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No payments found.</p>
          )
        )}
      </header>
    </div>
  );
}

export default App;

