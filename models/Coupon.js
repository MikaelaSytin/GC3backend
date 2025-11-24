const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["percent", "fixed"], default: "percent" },
  amount: { type: Number, required: true },
  maxUses: { type: Number, default: null },
  used: { type: Number, default: 0 },
  expiresAt: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Coupon", CouponSchema);
