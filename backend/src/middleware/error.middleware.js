import multer from "multer";
import AppError from "../utils/apiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (error, req, res, next) => {
  let normalizedError = error;

  if (error instanceof multer.MulterError) {
    normalizedError = new AppError(error.message, 400);
  } else if (error.name === "CastError") {
    normalizedError = new AppError("Resource not found.", 404);
  } else if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    normalizedError = new AppError(`${duplicateField} already exists.`, 409);
  } else if (!(error instanceof AppError)) {
    normalizedError = new AppError(error.message || "Internal server error.", 500);
  }

  const responsePayload = {
    success: false,
    message: normalizedError.message,
  };

  if (normalizedError.details) {
    responsePayload.details = normalizedError.details;
  }

  if (process.env.NODE_ENV !== "production" && normalizedError.stack) {
    responsePayload.stack = normalizedError.stack;
  }

  res.status(normalizedError.statusCode || 500).json(responsePayload);
};
