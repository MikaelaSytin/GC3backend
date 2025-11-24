const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  serviceName: { type: String },
  unitId: { type: String, required: true },
  unitName: { type: String },
  date: { type: String, required: true }, // keep as string for compatibility
  time: { type: String, required: true }, // "HH:MM"
  price: { type: Number },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  couponCode: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "confirmed", "confirmed_mock", "cancelled"],
    default: "pending"
  },
  confirmationCode: { type: String, default: null },
  history: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
