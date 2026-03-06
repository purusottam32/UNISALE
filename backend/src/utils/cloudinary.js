import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const requiredCloudinaryKeys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const configureCloudinary = () => {
  const hasAllKeys = requiredCloudinaryKeys.every((key) => Boolean(process.env[key]));

  if (!hasAllKeys) {
    throw new Error("Cloudinary credentials are missing. Check environment variables.");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    try {
      configureCloudinary();
    } catch (error) {
      reject(error);
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  configureCloudinary();
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
