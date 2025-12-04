require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("../models/Service");

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/courtify";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Service.deleteMany({});
    console.log("🧹 Cleared existing services");

    const services = [
      {
        name: "Badminton Court",
        description: "Single court",
        duration: 60,
        price: 250,
        isActive: true,   // include if you use this field
      },
      {
        name: "Tennis Court",
        description: "Singles",
        duration: 60,
        price: 400,
        isActive: true,
      },
      {
        name: "Basketball Court",
        description: "Half-court",
        duration: 60,
        price: 600,
        isActive: true,
      },
    ];

    const result = await Service.insertMany(services);
    console.log(`🌱 Inserted ${result.length} services`);
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  }
}

run();
