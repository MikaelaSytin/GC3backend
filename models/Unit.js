const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String },
  indoorOutdoor: { type: String, enum: ["indoor", "outdoor", "any"], default: "any" }
}, { timestamps: true });

module.exports = mongoose.model("Unit", UnitSchema);
