const express = require("express");

const upload = require(
  "../middleware/uploadMiddleware"
);

const uploadToCloudinary = require(
  "../utils/uploadToCloudinary"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/single",
  protect,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a file to upload",
        });
      }

      const isPdf =
        req.file.mimetype ===
        "application/pdf";

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          {
            folder: isPdf
              ? "driveease/documents"
              : "driveease/images",

            resourceType: isPdf
              ? "raw"
              : "image",
          }
        );

      return res.status(200).json({
        success: true,

        message:
          "File uploaded successfully",

        data: {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType:
            result.resource_type,
          originalName:
            req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to upload file",
      });
    }
  }
);

module.exports = router;