const Booking = require("../models/Booking");
const Coupon = require("../models/Coupon");
const Loyalty = require("../models/Loyalty");
const { v4: uuidv4 } = require("uuid");

// Helper for history
function pushHistory(booking, actor, action, note = "") {
  booking.history.push({
    ts: new Date().toISOString(),
    actor,
    action,
    note
  });
}

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, serviceName, unitId, unitName, date, time, price, customerName, customerEmail, couponCode } = req.body;

    const conflict = await Booking.findOne({ unitId, date, time, status: { $ne: "cancelled" } });
    if (conflict) {
      return res.status(409).json({ success: false, error: "Slot already booked" });
    }

    const booking = await Booking.create({
      serviceId,
      serviceName,
      unitId,
      unitName,
      date,
      time,
      price,
      customerName,
      customerEmail,
      couponCode,
      status: "pending",
      history: []
    });

    pushHistory(booking, "system", "created", "Booking created (pending)");
    await booking.save();

    res.json({ success: true, booking });

  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, error: "Cannot confirm cancelled booking" });
    }

    if (booking.status === "confirmed" || booking.status === "confirmed_mock") {
      return res.json({ success: true, booking });
    }

    const code = uuidv4().split("-")[0].toUpperCase();

    booking.confirmationCode = code;
    booking.status = process.env.MOCK_MODE === "true" ? "confirmed_mock" : "confirmed";

    pushHistory(booking, "system", "confirmed", `Confirmation code ${code}`);

    if (booking.couponCode) {
      const coupon = await Coupon.findOne({ code: booking.couponCode.toUpperCase() });
      if (coupon) {
        coupon.used += 1;
        await coupon.save();
        pushHistory(booking, "system", "coupon_applied", `Coupon ${coupon.code} used`);
      }
    }

    const key = booking.customerName || booking.customerEmail || "guest";
    let loyalty = await Loyalty.findOne({ customerName: key });
    if (!loyalty) {
      loyalty = await Loyalty.create({ customerName: key, points: 100 });
    } else {
      loyalty.points += 100;
      await loyalty.save();
    }

    pushHistory(booking, "system", "loyalty_added", `Added 100 points to ${key}`);

    await booking.save();

    res.json({ success: true, booking });

  } catch (err) {
    console.error("confirmBooking error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.rescheduleBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const { date, time } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

    const conflict = await Booking.findOne({
      unitId: booking.unitId,
      date,
      time,
      status: { $ne: "cancelled" },
      _id: { $ne: id }
    });
    if (conflict) return res.status(409).json({ success: false, error: "Slot conflict" });

    booking.date = date;
    booking.time = time;

    pushHistory(booking, "system", "rescheduled", `Rescheduled to ${date} ${time}`);

    await booking.save();

    res.json({ success: true, booking });

  } catch (err) {
    console.error("rescheduleBooking error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
