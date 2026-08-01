const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const User = require("./models/userModel");
const Car = require("./models/carModel");

const initialCars = [
  {
    name: "BMW M4",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
    capacity: 4,
    fuelType: "Petrol",
    rentPerHour: 1000,
    bookedTimeSlots: []
  },
  {
    name: "Mercedes-Benz C-Class",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb45678?w=800",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 1800,
    bookedTimeSlots: []
  },
  {
    name: "BMW X5",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    capacity: 7,
    fuelType: "Petrol",
    rentPerHour: 2500,
    bookedTimeSlots: []
  },
  {
    name: "Audi A6",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 2200,
    bookedTimeSlots: []
  },
  {
    name: "Toyota Fortuner",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    capacity: 7,
    fuelType: "Diesel",
    rentPerHour: 2000,
    bookedTimeSlots: []
  },
  {
    name: "Hyundai Tucson",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
    capacity: 5,
    fuelType: "Petrol",
    rentPerHour: 1700,
    bookedTimeSlots: []
  },
  {
    name: "Kia Carnival",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
    capacity: 7,
    fuelType: "Diesel",
    rentPerHour: 2600,
    bookedTimeSlots: []
  },
  {
    name: "Range Rover Velar",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800",
    capacity: 5,
    fuelType: "Diesel",
    rentPerHour: 3500,
    bookedTimeSlots: []
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected successfully to MongoDB Atlas.");

    // Seed Admin Users
    const adminAccounts = [
      { username: "Darshil Doshi", password: "doshi@10", isAdmin: true },
      { username: "darshildoshi", password: "doshi@10", isAdmin: true },
      { username: "parthpatel79_", password: "Parth0!81#", isAdmin: true }
    ];

    for (const adminData of adminAccounts) {
      const existing = await User.findOne({ username: adminData.username });
      if (!existing) {
        await User.create(adminData);
        console.log(`✅ Created Admin account: ${adminData.username}`);
      } else {
        existing.isAdmin = true;
        existing.password = adminData.password;
        await existing.save();
        console.log(`✅ Updated Admin account: ${adminData.username}`);
      }
    }

    // Seed Cars Collection if empty
    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      await Car.insertMany(initialCars);
      console.log(`✅ Successfully seeded ${initialCars.length} luxury vehicles into MongoDB Atlas!`);
    } else {
      console.log(`ℹ️ Cars collection already contains ${carCount} vehicles.`);
    }

    console.log("🎉 MongoDB Atlas Database Setup Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
