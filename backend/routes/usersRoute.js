const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const inputUsername = req.body.username ? req.body.username.trim() : "";
    const password = req.body.password;

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${inputUsername.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, "i") },
      password: password,
    });

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
router.get("/fixadmin", async (req, res) => {
  try {
    const adminAccounts = [
      { username: "Darshil Doshi", password: "doshi@10", isAdmin: true },
      { username: "darshildoshi", password: "doshi@10", isAdmin: true },
      { username: "parthpatel79_", password: "Parth0!81#", isAdmin: true }
    ];

    for (const adminData of adminAccounts) {
      const existing = await User.findOne({ username: adminData.username });
      if (!existing) {
        await User.create(adminData);
      } else {
        existing.isAdmin = true;
        existing.password = adminData.password;
        await existing.save();
      }
    }

    res.send("✅ Admin accounts (Darshil Doshi / parthpatel79_) fixed successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fixing admin");
  }
});

module.exports = router;