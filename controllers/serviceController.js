const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json({ success: true, services });
  } catch (err) {
    console.error("getServices error:", err);
    res.status(500).json({ success: false, error: "Server error" });
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
