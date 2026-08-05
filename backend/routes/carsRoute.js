const express = require("express");
const mongoose = require("mongoose");

const Car = require("../models/carModel");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public cars
router.get("/getallcars", async (req, res) => {
  try {
    const cars = await Car.find({
      isPublic: {
        $ne: false,
      },

      isActive: {
        $ne: false,
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json(cars);
  } catch (error) {
    console.error("GET CARS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load cars",
    });
  }
});

// Admin adds platform-owned car
router.post(
  "/addcar",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const newCar = await Car.create({
        ...req.body,
        listingType: "platform",
        owner: null,
        isPublic: true,
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: "Car added successfully",

        data: {
          car: newCar,
        },
      });
    } catch (error) {
      console.error("ADD CAR ERROR:", error);

      return res.status(400).json({
        success: false,
        message:
          error.message || "Unable to add car",
      });
    }
  }
);

// Admin edits car
router.post(
  "/editcar",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { _id } = req.body;

      if (
        !_id ||
        !mongoose.Types.ObjectId.isValid(_id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid car ID",
        });
      }

      const car = await Car.findById(_id);

      if (!car) {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }

      const editableFields = [
        "name",
        "brand",
        "model",
        "manufacturingYear",
        "registrationNumber",
        "image",
        "images",
        "capacity",
        "fuelType",
        "transmission",
        "location",
        "description",
        "rentPerHour",
        "commissionRate",
        "isPublic",
        "isActive",
      ];

      editableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          car[field] = req.body[field];
        }
      });

      await car.save();

      return res.status(200).json({
        success: true,
        message:
          "Car details updated successfully",

        data: {
          car,
        },
      });
    } catch (error) {
      console.error("EDIT CAR ERROR:", error);

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Unable to update car",
      });
    }
  }
);

// Admin deletes car
router.post(
  "/deletecar",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { carid } = req.body;

      if (
        !carid ||
        !mongoose.Types.ObjectId.isValid(carid)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid car ID",
        });
      }

      const car =
        await Car.findByIdAndDelete(carid);

      if (!car) {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Car deleted successfully",
      });
    } catch (error) {
      console.error("DELETE CAR ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to delete car",
      });
    }
  }
);

module.exports = router;