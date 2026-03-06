import mongoose from "mongoose";
import AppError from "../utils/apiError.js";

export const validateRequiredFields = (fields) => (req, res, next) => {
  const missingFields = fields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    next(new AppError(`Missing required fields: ${missingFields.join(", ")}`, 400));
    return;
  }

  next();
};

export const validateEmailField = (fieldName = "email") => (req, res, next) => {
  const email = req.body[fieldName];

  if (!email) {
    next();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(String(email).toLowerCase())) {
    next(new AppError("Please provide a valid email address.", 400));
    return;
  }

  next();
};

export const validatePriceField = (fieldName = "price") => (req, res, next) => {
  const value = req.body[fieldName];
  const price = Number(value);

  if (Number.isNaN(price) || price < 0) {
    next(new AppError("Price must be a number greater than or equal to 0.", 400));
    return;
  }

  next();
};

export const validateObjectIdField = (fieldName) => (req, res, next) => {
  const value = req.body[fieldName];

  if (value === undefined || value === null || value === "") {
    next();
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    next(new AppError(`Invalid ${fieldName}.`, 400));
    return;
  }

  next();
};

export const validateObjectIdParam = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];

  if (!mongoose.Types.ObjectId.isValid(value)) {
    next(new AppError(`Invalid ${paramName}.`, 400));
    return;
  }

  next();
};
