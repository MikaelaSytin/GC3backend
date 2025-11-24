// server.js
// Courtify — secure backend with auth, bookings, analytics

require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

// Auth middleware for role-based access
const { protect, adminOnly } = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const unitRoutes = require("./routes/unitRoutes");
const couponRoutes = require("./routes/couponRoutes");
const loyaltyRoutes = require("./routes/loyaltyRoutes");
const adminRoutes = require("./routes/adminRoutes"); // NEW

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/courtify";
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:4000";

/* -------------------------
   Global middleware
   ------------------------- */

// CORS (front-end to back-end)
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// Basic anti-abuse: rate limit (prevents brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200,                 // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Simple request logger
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

/* -------------------------
   MongoDB connection
   ------------------------- */

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* -------------------------
   API routes
   ------------------------- */

// Auth (signup/login -> returns JWT token)
app.use("/api/auth", authRoutes);

// Bookings, services, units, coupons, loyalty (public or protected as you like)
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/loyalty", loyaltyRoutes);

// Admin analytics (MUST be admin + logged-in)
app.use("/api/admin", protect, adminOnly, adminRoutes);

/* -------------------------
   Serve frontend static files
   ------------------------- */

const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
app.use(express.static(FRONTEND_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

/* -------------------------
   Start server
   ------------------------- */

app.listen(PORT, () => {
  console.log(`Courtify server running on http://localhost:${PORT}`);
});
