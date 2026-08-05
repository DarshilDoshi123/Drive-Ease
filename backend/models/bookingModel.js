const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
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

    carOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    bookedTimeSlots: {
      from: {
        type: Date,
        required: true,
      },

      to: {
        type: Date,
        required: true,
      },
    },

    totalHours: {
      type: Number,
      required: true,
      min: 1,
    },

    rentPerHour: {
      type: Number,
      required: true,
    },

    baseAmount: {
      type: Number,
      required: true,
    },

    driverRequired: {
      type: Boolean,
      default: false,
    },

    driverCharge: {
      type: Number,
      default: 0,
    },

    serviceFee: {
      type: Number,
      default: 0,
    },

    commissionRate: {
      type: Number,
      default: 0,
    },

    platformCommission: {
      type: Number,
      default: 0,
    },

    ownerEarning: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "pay_at_pickup"],
      default: "pay_at_pickup",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "confirmed",
    },

    payoutStatus: {
      type: String,
      enum: [
        "not_applicable",
        "pending",
        "processing",
        "paid",
      ],
      default: "not_applicable",
    },

    transactionId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model(
  "bookings",
  bookingSchema
);

module.exports = Booking;