// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (user must be logged in)
exports.protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized. No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "User not found" });
    }
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res
      .status(401)
      .json({ success: false, error: "Token invalid or expired" });
  }
};

// Only admin can access
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin only" });
  }
  next();
};
