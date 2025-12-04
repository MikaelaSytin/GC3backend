// controllers/serviceController.js

const Service = require("../models/Service");

// GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    // return ALL services in the collection
    const services = await Service.find();   // 👈 no filters

    res.json({
      success: true,
      services,
    });
  } catch (err) {
    console.error("Error fetching services:", err);
    next(err);
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, units } = req.body;

    const service = await Service.create({
      name,
      units: units || []
    });

    res.json({ success: true, service });
  } catch (err) {
    console.error("createService error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
