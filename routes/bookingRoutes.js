const express = require("express");
const router = express.Router();
const booking = require("../controllers/bookingController");

router.post("/", booking.createBooking);
router.get("/", booking.getAllBookings);
router.post("/:id/confirm", booking.confirmBooking);
router.post("/:id/reschedule", booking.rescheduleBooking);

module.exports = router;
