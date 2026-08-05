const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoose = require("mongoose");

const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://drive-ease-car-rental.vercel.app",
  "https://carrentalbyparthdarshil.netlify.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".netlify.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Request logger without displaying passwords or request bodies.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/cars", require("./routes/carsRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/bookings", require("./routes/bookingsRoute"));
app.use(
  "/api/car-listings",
  require("./routes/carListingRoutes")
);
app.use(
  "/api/uploads",
  require("./routes/uploadRoute")
);
app.use(
  "/api/reviews",
  require("./routes/reviewRoutes")
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: "DriveEase API is healthy",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DriveEase Car Rental API is running",
  });
});

// Serve React build if frontend and backend are deployed together.
if (process.env.NODE_ENV === "production") {
  const path = require("path");

  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(
      path.resolve(__dirname, "..", "frontend", "build", "index.html")
    );
  });
}

// API 404 handler.
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// General error handler.
app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error.message);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

const startServer = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGO_URL or MONGODB_URL is missing");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connection Successful");

    app.listen(port, () => {
      console.log(`DriveEase server started on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

