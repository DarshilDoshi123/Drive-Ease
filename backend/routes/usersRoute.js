const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
  },
});

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const createSafeUser = (user) => ({
  _id: user._id,
  username: user.username,
  isAdmin: user.isAdmin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ================= REGISTER =================

router.post(
  "/register",
  authenticationLimiter,
  async (req, res) => {
    try {
      const username =
        typeof req.body.username === "string"
          ? req.body.username.trim()
          : "";

      const password =
        typeof req.body.password === "string"
          ? req.body.password
          : "";

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must contain at least 3 characters",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least 8 characters",
        });
      }

      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        username,
        password: hashedPassword,
        isAdmin: false,
      });

      return res.status(201).json({
        success: true,
        message: "Registration successful. Please log in.",
        data: {
          user: createSafeUser(newUser),
        },
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error.message);

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  }
);

// ================= LOGIN =================

router.post(
  "/login",
  authenticationLimiter,
  async (req, res) => {
    try {
      const username =
        typeof req.body.username === "string"
          ? req.body.username.trim()
          : "";

      const password =
        typeof req.body.password === "string"
          ? req.body.password
          : "";

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      const user = await User.findOne({
        username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      let passwordMatches = false;
      const passwordIsHashed = user.password.startsWith("$2");

      /*
        Existing users in your current database may still have
        plain-text passwords.

        If the old password matches, this automatically converts
        it to bcrypt after successful login.
      */
      if (passwordIsHashed) {
        passwordMatches = await bcrypt.compare(password, user.password);
      } else {
        passwordMatches = password === user.password;

        if (passwordMatches) {
          user.password = await bcrypt.hash(password, 12);
          await user.save();
        }
      }

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const token = createToken(user);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: createSafeUser(user),
          token,
        },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error.message);

      return res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  }
);

// ================= CURRENT USER =================

router.get("/me", protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = router;