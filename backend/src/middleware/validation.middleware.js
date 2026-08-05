import mongoose from "mongoose";
import { ZodError } from "zod";
import AppError from "../utils/apiError.js";

/** Zod exposes issues as `.issues`; older versions used `.errors`. */
const toFieldErrors = (error) =>
  (error.issues || error.errors || []).map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

/**
 * Validates `req.body` against a Zod schema and replaces it with the parsed
 * result, so downstream handlers always receive coerced, trimmed values.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      next(new AppError("Validation failed.", 422, toFieldErrors(error)));
      return;
    }
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      next(new AppError("Invalid query parameters.", 422, toFieldErrors(error)));
      return;
    }
    next(error);
  }
};

/**
 * `multipart/form-data` delivers every field as a string. Coerce the numeric
 * and boolean ones before Zod sees them.
 */
export const coerceFormBody = (numericFields = [], booleanFields = []) => (req, res, next) => {
  numericFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== "") {
      req.body[field] = Number(req.body[field]);
    }
  });
  booleanFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.body[field] = req.body[field] === true || req.body[field] === "true";
    }
  });
  next();
};

/** Rejects malformed ids at the edge so services never see invalid ObjectIds. */
export const validateObjectId = (paramName = "id") => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    next(new AppError(`Invalid ${paramName}.`, 400));
    return;
  }
  next();
};
