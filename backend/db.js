const mongoose = require("mongoose");
const dotenv = require("dotenv");

const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

async function connectDB() {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL or MONGODB_URL is missing in environment variables");
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connection Successful");
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error.message);

    process.exit(1);
  }
}

connectDB();

module.exports = mongoose;