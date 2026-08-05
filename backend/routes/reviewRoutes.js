const express = require("express");
const mongoose = require("mongoose");

const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================
// ADD REVIEW
// ======================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      bookingId,
      rating,
      title,
      comment,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(bookingId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking",
      });
    }

    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can review only your own booking",
      });
    }

    if (
      booking.bookingStatus !==
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Trip is not completed yet",
      });
    }

    const alreadyReviewed =
      await Review.findOne({
        booking: bookingId,
      });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message:
          "You have already reviewed this booking",
      });
    }

    const review = await Review.create({
      booking: booking._id,
      car: booking.car,
      user: req.user._id,
      rating,
      title,
      comment,
    });

    return res.status(201).json({
      success: true,
      message:
        "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit review",
    });
  }
});

// ======================================
// GET REVIEWS OF A CAR
// ======================================

router.get(
  "/car/:carId",
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          car: req.params.carId,
        })
          .populate(
            "user",
            "username"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  }
);

module.exports = router;