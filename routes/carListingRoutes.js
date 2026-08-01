const express = require("express");
const mongoose = require("mongoose");

const CarListingRequest = require(
  "../models/carListingRequestModel"
);

const Car = require("../models/carModel");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// USER: SUBMIT CAR LISTING REQUEST
// ==========================================

router.post("/submit", protect, async (req, res) => {
  try {
    const {
      ownerDetails,
      carDetails,
      carImages,
      documents,
    } = req.body;

    if (
      !ownerDetails?.fullName ||
      !ownerDetails?.email ||
      !ownerDetails?.phone ||
      !ownerDetails?.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete owner details are required",
      });
    }

    if (
      !carDetails?.name ||
      !carDetails?.brand ||
      !carDetails?.model ||
      !carDetails?.registrationNumber ||
      !carDetails?.fuelType ||
      !carDetails?.transmission ||
      !carDetails?.capacity ||
      !carDetails?.rentPerHour ||
      !carDetails?.location
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete car details are required",
      });
    }

    if (
      !Array.isArray(carImages) ||
      carImages.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one car image is required",
      });
    }

    if (
      !documents?.rcDocument ||
      !documents?.insuranceDocument ||
      !documents?.pucDocument ||
      !documents?.ownerIdDocument
    ) {
      return res.status(400).json({
        success: false,
        message: "All verification documents are required",
      });
    }

    const registrationNumber =
      carDetails.registrationNumber
        .trim()
        .toUpperCase();

    const existingPendingRequest =
      await CarListingRequest.findOne({
        "carDetails.registrationNumber":
          registrationNumber,

        status: {
          $in: [
            "pending",
            "approved",
            "changes_requested",
          ],
        },
      });

    if (existingPendingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "A listing request already exists for this registration number",
      });
    }

    const existingPublicCar = await Car.findOne({
      registrationNumber,
    });

    if (existingPublicCar) {
      return res.status(409).json({
        success: false,
        message:
          "This car is already listed on DriveEase",
      });
    }

    const request =
      await CarListingRequest.create({
        owner: req.user._id,

        ownerDetails,

        carDetails: {
          ...carDetails,
          registrationNumber,
        },

        carImages,
        documents,
        status: "pending",
      });

    return res.status(201).json({
      success: true,
      message:
        "Car listing request submitted successfully",

      data: {
        request,
      },
    });
  } catch (error) {
    console.error(
      "SUBMIT CAR LISTING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit car listing request",
    });
  }
});

// ==========================================
// USER: GET THEIR OWN REQUESTS
// ==========================================

router.get("/my-listings", protect, async (req, res) => {
  try {
    const requests =
      await CarListingRequest.find({
        owner: req.user._id,
      })
        .populate("approvedCar")
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,

      data: {
        requests,
      },
    });
  } catch (error) {
    console.error(
      "GET MY LISTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load your car listings",
    });
  }
});

// ==========================================
// USER: UPDATE REQUEST WHEN CHANGES REQUESTED
// ==========================================

router.patch(
  "/:requestId/resubmit",
  protect,
  async (req, res) => {
    try {
      const { requestId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(requestId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing request ID",
        });
      }

      const request =
        await CarListingRequest.findById(requestId);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Listing request not found",
        });
      }

      if (
        request.owner.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You cannot modify this listing request",
        });
      }

      if (
        ![
          "rejected",
          "changes_requested",
        ].includes(request.status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only rejected or change-requested listings can be resubmitted",
        });
      }

      const {
        ownerDetails,
        carDetails,
        carImages,
        documents,
      } = req.body;

      if (ownerDetails) {
        request.ownerDetails = {
          ...request.ownerDetails.toObject(),
          ...ownerDetails,
        };
      }

      if (carDetails) {
        request.carDetails = {
          ...request.carDetails.toObject(),
          ...carDetails,
        };
      }

      if (carImages) {
        request.carImages = carImages;
      }

      if (documents) {
        request.documents = {
          ...request.documents.toObject(),
          ...documents,
        };
      }

      request.status = "pending";
      request.adminRemark = "";
      request.reviewedBy = null;
      request.reviewedAt = null;

      await request.save();

      return res.status(200).json({
        success: true,
        message:
          "Listing request resubmitted successfully",

        data: {
          request,
        },
      });
    } catch (error) {
      console.error(
        "RESUBMIT LISTING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to resubmit listing request",
      });
    }
  }
);

// ==========================================
// ADMIN: GET ALL LISTING REQUESTS
// ==========================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status = "all" } = req.query;

      const query =
        status === "all"
          ? {}
          : { status };

      const requests =
        await CarListingRequest.find(query)
          .populate("owner", "username isAdmin")
          .populate(
            "reviewedBy",
            "username isAdmin"
          )
          .populate("approvedCar")
          .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,

        data: {
          requests,
        },
      });
    } catch (error) {
      console.error(
        "ADMIN LISTING REQUESTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load car listing requests",
      });
    }
  }
);

// ==========================================
// ADMIN: APPROVE REQUEST
// ==========================================

router.patch(
  "/admin/:requestId/approve",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { requestId } = req.params;

      const commissionRate = Number(
        req.body.commissionRate ?? 10
      );

      const adminRemark =
        req.body.adminRemark?.trim() || "";

      if (
        !mongoose.Types.ObjectId.isValid(requestId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing request ID",
        });
      }

      if (
        commissionRate < 0 ||
        commissionRate > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Commission rate must be between 0 and 100",
        });
      }

      const request =
        await CarListingRequest.findById(requestId);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Listing request not found",
        });
      }

      if (request.status === "approved") {
        return res.status(400).json({
          success: false,
          message:
            "This listing request is already approved",
        });
      }

      const existingCar = await Car.findOne({
        registrationNumber:
          request.carDetails.registrationNumber,
      });

      if (existingCar) {
        return res.status(409).json({
          success: false,
          message:
            "A public car already exists with this registration number",
        });
      }

      const car = await Car.create({
        name: request.carDetails.name,
        brand: request.carDetails.brand,
        model: request.carDetails.model,

        manufacturingYear:
          request.carDetails.manufacturingYear,

        registrationNumber:
          request.carDetails.registrationNumber,

        image: request.carImages[0],
        images: request.carImages,

        capacity:
          request.carDetails.capacity,

        fuelType:
          request.carDetails.fuelType,

        transmission:
          request.carDetails.transmission,

        location:
          request.carDetails.location,

        description:
          request.carDetails.description,

        rentPerHour:
          request.carDetails.rentPerHour,

        listingType: "owner",
        owner: request.owner,
        listingRequest: request._id,
        commissionRate,
        isPublic: true,
        isActive: true,
      });

      request.status = "approved";
      request.commissionRate = commissionRate;
      request.adminRemark = adminRemark;
      request.reviewedBy = req.user._id;
      request.reviewedAt = new Date();
      request.approvedCar = car._id;

      await request.save();

      return res.status(200).json({
        success: true,
        message:
          "Car listing approved and published successfully",

        data: {
          request,
          car,
        },
      });
    } catch (error) {
      console.error(
        "APPROVE LISTING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to approve car listing request",
      });
    }
  }
);

// ==========================================
// ADMIN: REJECT OR REQUEST CHANGES
// ==========================================

router.patch(
  "/admin/:requestId/review",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { requestId } = req.params;

      const {
        status,
        adminRemark,
      } = req.body;

      if (
        ![
          "rejected",
          "changes_requested",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be rejected or changes_requested",
        });
      }

      if (
        !adminRemark ||
        !adminRemark.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Admin remark is required",
        });
      }

      const request =
        await CarListingRequest.findById(requestId);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Listing request not found",
        });
      }

      request.status = status;
      request.adminRemark =
        adminRemark.trim();

      request.reviewedBy = req.user._id;
      request.reviewedAt = new Date();

      await request.save();

      return res.status(200).json({
        success: true,

        message:
          status === "rejected"
            ? "Car listing request rejected"
            : "Changes requested from car owner",

        data: {
          request,
        },
      });
    } catch (error) {
      console.error(
        "REVIEW LISTING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to review car listing request",
      });
    }
  }
);

module.exports = router;