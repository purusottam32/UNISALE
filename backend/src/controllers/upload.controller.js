import asyncHandler from "../utils/asyncHandler.js";
import { uploadImageService } from "../services/upload.service.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const result = await uploadImageService(req.file);
  res.status(201).json({ success: true, data: result });
});
