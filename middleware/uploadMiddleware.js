const multer = require("multer");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error(
        "Only JPG, PNG, WEBP and PDF files are allowed"
      )
    );
  }

  callback(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;