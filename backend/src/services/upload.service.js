import AppError from "../utils/apiError.js";
import { uploadImageToR2 } from "../utils/r2.js";

export const uploadImageService = async (file) => {
  if (!file?.buffer) {
    throw new AppError("Image file is required.", 400);
  }

  return uploadImageToR2(file.buffer, "uploads");
};
