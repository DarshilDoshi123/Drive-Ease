const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Username or Password",
      });
    }

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      username,
      password,
      isAdmin: false,
    });

    await newUser.save();

    res.send({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// ================= FIX ADMIN =================


module.exports = router;