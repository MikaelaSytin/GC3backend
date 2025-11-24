// controllers/adminController.js
const Booking = require("../models/Booking");

// GET /api/admin/analytics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {
      status: { $ne: "cancelled" },
    };

    // Filter by createdAt date range (optional)
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) {
        match.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const pipeline = [
      { $match: match },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: { $ifNull: ["$price", 0] },
                },
                totalBookings: { $sum: 1 },
              },
            },
          ],
          byService: [
            {
              $group: {
                _id: "$serviceId",
                serviceName: { $first: "$serviceName" },
                totalRevenue: {
                  $sum: { $ifNull: ["$price", 0] },
                },
                totalBookings: { $sum: 1 },
              },
            },
            { $sort: { totalRevenue: -1 } },
          ],
          byDate: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
                totalRevenue: {
                  $sum: { $ifNull: ["$price", 0] },
                },
                totalBookings: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ];

    const result = await Booking.aggregate(pipeline);

    const summaryDoc = result[0].summary[0] || {
      totalRevenue: 0,
      totalBookings: 0,
    };

    const byService = result[0].byService.map((item) => ({
      serviceId: item._id,
      serviceName: item.serviceName || "Unknown",
      totalRevenue: item.totalRevenue,
      totalBookings: item.totalBookings,
    }));

    const byDate = result[0].byDate.map((item) => ({
      date: item._id,
      totalRevenue: item.totalRevenue,
      totalBookings: item.totalBookings,
    }));

    return res.json({
      success: true,
      summary: summaryDoc,
      byService,
      byDate,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error" });
  }
};
