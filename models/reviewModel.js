const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
      required: true,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per booking
reviewSchema.index(
  { booking: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "reviews",
  reviewSchema
);