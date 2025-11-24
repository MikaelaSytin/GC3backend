const express = require("express");
const router = express.Router();
const unit = require("../controllers/unitController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", unit.getUnits);
router.post("/", protect, adminOnly, unit.createUnit);

module.exports = router;
