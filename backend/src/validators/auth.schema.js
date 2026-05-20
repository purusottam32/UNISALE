import { z } from "zod";

// ---------------------
// Reusable primitives
// ---------------------
const emailField = z
  .string({ required_error: "Email is required." })
  .email("Please provide a valid email address.")
  .toLowerCase()
  .trim();

const passwordField = z
  .string({ required_error: "Password is required." })
  .min(6, "Password must be at least 6 characters.");

// ---------------------
// Auth Schemas
// ---------------------
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters.")
    .trim(),
  email: emailField,
  password: passwordField,
});

export const verifyOtpSchema = z.object({
  email: emailField,
  otp: z
    .string({ required_error: "OTP is required." })
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only digits."),
});

export const resendOtpSchema = z.object({
  email: emailField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string({ required_error: "Password is required." }).min(1, "Password is required."),
});

export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required." }).optional(),
});

// ---------------------
// Profile Schema
// ---------------------
const usernameField = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username cannot exceed 30 characters.")
  .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores.")
  .trim()
  .toLowerCase()
  .optional();

export const completeProfileSchema = z.object({
  username: usernameField,
  college: z
    .string({ required_error: "College name is required." })
    .min(2, "College name must be at least 2 characters.")
    .max(120)
    .trim(),
  department: z
    .string({ required_error: "Department is required." })
    .min(2, "Department must be at least 2 characters.")
    .max(100)
    .trim(),
  year: z
    .number({ required_error: "Year is required.", invalid_type_error: "Year must be a number." })
    .int()
    .min(1, "Year must be between 1 and 6.")
    .max(6, "Year must be between 1 and 6."),
  bio: z.string().max(160, "Bio cannot exceed 160 characters.").trim().optional(),
});

export const updateProfileSchema = completeProfileSchema.partial();
