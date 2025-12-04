// server.js
// Courtify — secure backend with auth, bookings, analytics

require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const { AppError, sendApiError } = require("./utils/apiError");

// Auth middleware for role-based access
const { protect, adminOnly } = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const unitRoutes = require("./routes/unitRoutes");
const couponRoutes = require("./routes/couponRoutes");
const loyaltyRoutes = require("./routes/loyaltyRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 4000;

// IMPORTANT: prefer cloud/Atlas URI
const MONGO_URI =
  "mongodb+srv://mikaelasytin_db_user:moC6Ya8rV4jfNO23@cluster0.wgervcl.mongodb.net/courtify?retryWrites=true&w=majority&appName=Cluster0";

console.log("🔗 Using Mongo URI in server.js:", MONGO_URI);


const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:4000";

/* -------------------------
   Global middleware
   ------------------------- */

// trust Render's proxy so express-rate-limit & IP stuff works
app.set("trust proxy", 1);

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

// Bookings, services, units, coupons, loyalty
app.use("/api/bookings", bookingRoutes);

// Alias so existing frontend calls to /api/book and /api/book/:id/confirm work
app.use("/api/book", bookingRoutes);

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

// ---------- simple services API (for /api/services) ----------
// Frontend falls back to demo if this fails, but we return a real list.

app.get("/api/services", (req, res) => {
  const services = [
    { id: "svc-1", name: "Badminton",  description: "Single court", duration: 60, price: 250 },
    { id: "svc-2", name: "Tennis",     description: "Singles",      duration: 60, price: 400 },
    { id: "svc-3", name: "Basketball", description: "Half-court",   duration: 60, price: 600 },
    { id: "svc-4", name: "Pickleball", description: "Doubles",      duration: 60, price: 300 },
    { id: "svc-5", name: "Soccer",     description: "5-a-side",     duration: 60, price: 800 }
  ];
  res.json({ success: true, services });
});

app.listen(PORT, () => {
  console.log(`Courtify server running on http://localhost:${PORT}`);
});
