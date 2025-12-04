const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: Number, required: true }, // minutes
    price: { type: Number, required: true },
    // optional, but if you use it in queries:
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
