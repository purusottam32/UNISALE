import { ZodError } from "zod";
import AppError from "../utils/apiError.js";

/**
 * Zod validation middleware factory.
 * Validates req.body against the given Zod schema.
 * On failure, throws a 422 AppError with formatted field errors.
 *
 * Usage: router.post('/route', validate(mySchema), controller)
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed; // replace with coerced/transformed values
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return next(new AppError("Validation failed.", 422, details));
    }
    next(error);
  }
};

/**
 * Validates req.query instead of req.body.
 */
/**
 * Coerces multipart/form-data string values before Zod validation.
 * Usage: router.post('/route', upload.single('file'), coerceFormBody(['year']), validate(schema), ...)
 */
export const coerceFormBody = (numericFields = []) => (req, res, next) => {
  numericFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== "") {
      req.body[field] = Number(req.body[field]);
    }
  });
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.query);
    req.query = parsed;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new AppError("Invalid query parameters.", 422, details));
    }
    next(error);
  }
};
