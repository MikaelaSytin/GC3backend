const Unit = require("../models/Unit");

exports.getUnits = async (req, res) => {
  try {
    const units = await Unit.find({});
    res.json({ success: true, units });
  } catch (err) {
    console.error("getUnits error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.createUnit = async (req, res) => {
  try {
    const { serviceId, name, location, indoorOutdoor } = req.body;

    const unit = await Unit.create({
      serviceId,
      name,
      location,
      indoorOutdoor
    });

    res.json({ success: true, unit });
  } catch (err) {
    console.error("createUnit error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
