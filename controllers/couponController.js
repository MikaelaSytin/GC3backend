const Coupon = require("../models/Coupon");

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ success: true, coupons });
  } catch (err) {
    console.error("getCoupons error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, type, amount, maxUses, expiresAt } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      amount,
      maxUses,
      expiresAt
    });

    res.json({ success: true, coupon });
  } catch (err) {
    console.error("createCoupon error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
