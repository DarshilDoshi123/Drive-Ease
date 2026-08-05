const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (
  fileBuffer,
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder:
            options.folder ||
            "driveease/uploads",

          resource_type:
            options.resourceType ||
            "auto",

          use_filename: true,
          unique_filename: true,
        },

        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;