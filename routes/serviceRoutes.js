const express = require("express");
const router = express.Router();
const service = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", service.getServices);
router.post("/", protect, adminOnly, service.createService);

module.exports = router;
