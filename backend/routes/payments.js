import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Simulated payments database (replace later with real DB or API)
const payments = [];

// --------------------
//  POST /api/payments
// --------------------
// Create a new payment (protected route)
router.post("/", async (req, res) => {
  try {
    const { amount, currency, recipient } = req.body;

    // Basic input validation
    if (!amount || !currency || !recipient) {
      return res.status(400).json({ message: "Missing required payment fields." });
    }

    // Create mock payment record
    const payment = {
      id: payments.length + 1,
      user: req.user, // from authenticateToken middleware
      amount,
      currency,
      recipient,
      date: new Date().toISOString(),
      status: "pending",
    };

    payments.push(payment);

    // Simulate payment success
    payment.status = "completed";

    res.status(201).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Payment processing failed" });
  }
});

// --------------------
// GET /api/payments
// --------------------
// Retrieve all payments for logged-in user
router.get("/", (req, res) => {
  try {
    const userPayments = payments.filter(
      (p) => p.user && p.user.id === req.user.id
    );
    res.json(userPayments);
  } catch (error) {
    console.error("Fetch payments error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

export default router;
