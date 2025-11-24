// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/adminController");

// /api/admin/analytics
router.get("/analytics", getAnalytics);

module.exports = router;
