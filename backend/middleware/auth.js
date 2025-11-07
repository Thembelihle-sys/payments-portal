import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Check for token in Authorization header (Bearer token)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token with your secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // attach user info to request
    next(); // proceed to next middleware/route
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
