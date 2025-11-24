const express = require("express");
const router = express.Router();
const coupon = require("../controllers/couponController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", coupon.getCoupons);
router.post("/", protect, adminOnly, coupon.createCoupon);

module.exports = router;
