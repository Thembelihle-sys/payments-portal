// Load environment variables from .env
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// Ensure environment variables are loaded
if (!process.env.PORT) {
  console.warn("⚠️  PORT not found in .env file. Using default 5000.");
}

// Use PORT from .env or fallback
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
