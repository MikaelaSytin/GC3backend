// backend/scripts/seedServices.js

require("dotenv").config();
const mongoose = require("mongoose");

// Make sure we can require models with correct relative path
const Service = require("../models/Service");

// Use the same URI as your server (Atlas in production)
const MONGO_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/courtify";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing services so you don't duplicate
    await Service.deleteMany({});
    console.log("🧹 Cleared existing services");

    const services = [
      {
        name: "Badminton Court",
        description: "Single court",
        duration: 60,
        price: 250,
      },
      {
        name: "Tennis Court",
        description: "Singles",
        duration: 60,
        price: 400,
      },
      {
        name: "Basketball Court",
        description: "Half-court",
        duration: 60,
        price: 600,
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
