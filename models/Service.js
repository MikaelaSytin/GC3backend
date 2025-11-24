const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  units: { type: Array, default: [] } // matches your JSON structure
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema);
