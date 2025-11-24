const Loyalty = require("../models/Loyalty");

exports.getLoyalty = async (req, res) => {
  try {
    const name = String(req.query.customerName || "").trim();

    if (!name) {
      return res.status(400).json({ success: false, error: "customerName query required" });
    }

    let record = await Loyalty.findOne({ customerName: name });
    const points = record ? record.points : 0;

    res.json({ success: true, name, points });

  } catch (err) {
    console.error("getLoyalty error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
