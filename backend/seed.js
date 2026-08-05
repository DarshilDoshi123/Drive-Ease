const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.join(__dirname, ".env") });

const Car = require("./models/carModel");
const User = require("./models/userModel");

const seedCars = [
  {
    name: "Porsche 911 Carrera S",
    brand: "Porsche",
    model: "911 Carrera S Coupe",
    manufacturingYear: 2024,
    registrationNumber: "GJ01PC9110",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&q=80",
    ],
    capacity: 2,
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Mumbai",
    rentPerHour: 4500,
    description: "Iconic rear-engine sports car delivering thrilling twin-turbo performance, precision handling, active aerodynamics, and timeless German engineering.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "BMW M4 Competition",
    brand: "BMW",
    model: "M4 Competition Coupe",
    manufacturingYear: 2023,
    registrationNumber: "GJ01M44444",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    ],
    capacity: 4,
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Ahmedabad",
    rentPerHour: 3200,
    description: "High-performance luxury coupe featuring M TwinPower Turbo 503 HP inline-6 engine, M xDrive AWD system, and carbon fiber interior accents.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Mercedes-Benz C-Class AMG Line",
    brand: "Mercedes-Benz",
    model: "C300 AMG Line Sedan",
    manufacturingYear: 2024,
    registrationNumber: "GJ01MB3000",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb45678?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb45678?w=1200&q=80",
    ],
    capacity: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Ahmedabad",
    rentPerHour: 2200,
    description: "Sophisticated luxury sedan equipped with MBUX portrait display, panoramic sunroof, ambient lighting, and ultra-smooth turbocharged power.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Range Rover Velar R-Dynamic",
    brand: "Land Rover",
    model: "Velar R-Dynamic SE",
    manufacturingYear: 2023,
    registrationNumber: "GJ01RR7777",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
    ],
    capacity: 5,
    fuelType: "Diesel",
    transmission: "Automatic",
    location: "Mumbai",
    rentPerHour: 3800,
    description: "Avant-garde luxury SUV offering unmatched cabin refinement, terrain response 4WD, Meridian 3D sound, and flush deployable door handles.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    model: "Model S Plaid Tri-Motor",
    manufacturingYear: 2024,
    registrationNumber: "GJ01TS1020",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
    ],
    capacity: 5,
    fuelType: "Electric",
    transmission: "Automatic",
    location: "Bangalore",
    rentPerHour: 4000,
    description: "Tri-motor electric flagship delivering 1,020 HP, 0-60 mph in 1.99s, Full Self-Driving capability, and a 17-inch cinematic center touchscreen.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Audi RS6 Avant Performance",
    brand: "Audi",
    model: "RS6 Avant 4.0 V8 TFSI",
    manufacturingYear: 2023,
    registrationNumber: "GJ01AU6666",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    ],
    capacity: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Delhi",
    rentPerHour: 3500,
    description: "Super-wagon combining 621 HP twin-turbo V8 speed with practical family luxury, Quattro sport differential, and RS sport suspension.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Toyota Fortuner Legender",
    brand: "Toyota",
    model: "Fortuner Legender 4x4",
    manufacturingYear: 2023,
    registrationNumber: "GJ01TF8888",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
    ],
    capacity: 7,
    fuelType: "Diesel",
    transmission: "Automatic",
    location: "Ahmedabad",
    rentPerHour: 2400,
    description: "Commanding 7-seater luxury SUV featuring aggressive quad-LED headlights, dual-tone interiors, ventilated seats, and legendary off-road 4WD.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Ford Mustang GT Fastback",
    brand: "Ford",
    model: "Mustang GT 5.0 V8",
    manufacturingYear: 2022,
    registrationNumber: "GJ01FD5000",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&q=80",
    ],
    capacity: 4,
    fuelType: "Petrol",
    transmission: "Manual",
    location: "Mumbai",
    rentPerHour: 2800,
    description: "Iconic American muscle car powered by a roaring 450 HP Coyote 5.0L V8, active valve performance exhaust, and MagneRide damping system.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Hyundai Tucson Signature",
    brand: "Hyundai",
    model: "Tucson Signature 2.0 AWD",
    manufacturingYear: 2024,
    registrationNumber: "GJ01HT2024",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
    ],
    capacity: 5,
    fuelType: "Diesel",
    transmission: "Automatic",
    location: "Ahmedabad",
    rentPerHour: 1600,
    description: "Futuristic compact SUV equipped with Level-2 ADAS safety, parametric hidden lights, memory seats, and ultra-quiet highway cruising.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
  {
    name: "Honda Civic Type R FL5",
    brand: "Honda",
    model: "Civic Type R 2.0 Turbo",
    manufacturingYear: 2024,
    registrationNumber: "GJ01HC3150",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
    ],
    capacity: 4,
    fuelType: "Petrol",
    transmission: "Manual",
    location: "Bangalore",
    rentPerHour: 1900,
    description: "Track-honed hot hatch boasting 315 HP turbocharged engine, 6-speed manual with rev-matching, +R driving mode, and Brembo front brakes.",
    listingType: "platform",
    bookedTimeSlots: [],
    isPublic: true,
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL or MONGODB_URL is missing in environment variables");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected successfully to MongoDB Atlas.");

    // Wipe existing car records to provide a fresh, realistic fleet
    console.log("Cleaning up existing car records...");
    await Car.deleteMany({});
    console.log("Cleared cars collection.");

    // Insert new 10 car listings
    console.log(`Inserting ${seedCars.length} realistic car listings...`);
    const insertedCars = await Car.insertMany(seedCars);
    console.log(`✅ Successfully seeded ${insertedCars.length} vehicle listings into MongoDB Atlas!`);

    insertedCars.forEach((car, idx) => {
      console.log(`   ${idx + 1}. [${car.brand}] ${car.name} (${car.fuelType}, ${car.capacity} Seats) - ₹${car.rentPerHour}/hr [${car.location}]`);
    });

    // Ensure Admin account 'darshildoshi' exists
    const adminUsername = "darshildoshi";
    const adminPassword = "doshi@10";
    let adminUser = await User.findOne({ username: adminUsername });

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    if (!adminUser) {
      adminUser = await User.create({
        username: adminUsername,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log(`✅ Admin account '${adminUsername}' created.`);
    } else {
      adminUser.isAdmin = true;
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log(`✅ Admin account '${adminUsername}' verified & updated.`);
    }

    console.log("🎉 Database Seeding Completed Successfully!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding error:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDatabase();
