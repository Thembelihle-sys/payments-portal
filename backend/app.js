import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { authenticateToken } from "./middleware/auth.js";
import paymentsRoute from "./routes/payments.js";

const app = express();

// Enable trust proxy (useful for HTTPS redirection behind reverse proxies)
app.enable("trust proxy");

// --------------------
// 🔒 SECURITY MIDDLEWARE
// --------------------
app.use(helmet()); // Set secure HTTP headers

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // safer dynamic origin
    credentials: true,
  })
);

// Limit repeated requests to public APIs
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(express.json()); // Parse incoming JSON requests

// --------------------
//  FORCE HTTPS (production only)
// --------------------
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    !(req.secure || req.headers["x-forwarded-proto"] === "https")
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// --------------------
//  ROUTES
// --------------------
app.use("/api/payments", authenticateToken, paymentsRoute);

// --------------------
//  404 HANDLER
// --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------------
//  GLOBAL ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
