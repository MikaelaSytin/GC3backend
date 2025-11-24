const express = require("express");
const router = express.Router();
const loyalty = require("../controllers/loyaltyController");

router.get("/", loyalty.getLoyalty);

module.exports = router;
