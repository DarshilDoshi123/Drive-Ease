const mongoose = require("mongoose");

const carListingRequestSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    ownerDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    carDetails: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      brand: {
        type: String,
        required: true,
        trim: true,
      },

      model: {
        type: String,
        required: true,
        trim: true,
      },

      manufacturingYear: {
        type: Number,
        required: true,
      },

      registrationNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      fuelType: {
        type: String,
        required: true,
        enum: [
          "Petrol",
          "Diesel",
          "Electric",
          "CNG",
          "Hybrid",
        ],
      },

      transmission: {
        type: String,
        required: true,
        enum: ["Manual", "Automatic"],
      },

      capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
      },

      rentPerHour: {
        type: Number,
        required: true,
        min: 1,
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },
    },

    carImages: {
      type: [String],
      required: true,
      validate: {
        validator(images) {
          return Array.isArray(images) && images.length > 0;
        },
        message: "At least one car image is required",
      },
    },

    documents: {
      rcDocument: {
        type: String,
        required: true,
      },

      insuranceDocument: {
        type: String,
        required: true,
      },

      pucDocument: {
        type: String,
        required: true,
      },

      ownerIdDocument: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "changes_requested",
      ],
      default: "pending",
    },

    adminRemark: {
      type: String,
      default: "",
      trim: true,
    },

    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    approvedCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

carListingRequestSchema.index({
  owner: 1,
  createdAt: -1,
});

carListingRequestSchema.index({
  status: 1,
  createdAt: -1,
});

const CarListingRequest = mongoose.model(
  "carListingRequests",
  carListingRequestSchema
);

module.exports = CarListingRequest;