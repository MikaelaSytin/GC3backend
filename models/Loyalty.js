const mongoose = require("mongoose");

const LoyaltySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Loyalty", LoyaltySchema);
