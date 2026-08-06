const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    model: {
      type: String,
      default: "",
      trim: true,
    },

    manufacturingYear: {
      type: Number,
      default: null,
    },

    registrationNumber: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    fuelType: {
      type: String,
      required: true,
      trim: true,
    },

    transmission: {
      type: String,
      default: "Manual",
      enum: ["Manual", "Automatic"],
    },

    location: {
      type: String,
      default: "Ahmedabad",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    descriptionImage: {
      type: String,
      default: "",
      trim: true,
    },

    bookedTimeSlots: [
      {
        from: {
          type: Date,
          required: true,
        },

        to: {
          type: Date,
          required: true,
        },

        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "bookings",
        },
      },
    ],

    rentPerHour: {
      type: Number,
      required: true,
      min: 1,
    },

    listingType: {
      type: String,
      enum: ["platform", "owner"],
      default: "platform",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    listingRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carListingRequests",
      default: null,
    },

    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("cars", carSchema);

module.exports = Car;