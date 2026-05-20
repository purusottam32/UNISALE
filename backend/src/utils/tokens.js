import jwt from "jsonwebtoken";
import AppError from "./apiError.js";

const getSecret = (key) => {
  const secret = process.env[key];
  if (!secret) throw new AppError(`${key} is missing in environment variables.`, 500);
  return secret;
};

export const signAccessToken = (payload) =>
  jwt.sign(payload, getSecret("JWT_ACCESS_SECRET"), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, getSecret("JWT_REFRESH_SECRET"), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, getSecret("JWT_ACCESS_SECRET"));
  } catch {
    throw new AppError("Invalid or expired access token.", 401);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, getSecret("JWT_REFRESH_SECRET"));
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }
};

export const cookieOptions = (maxAgeMs) => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: maxAgeMs,
    path: "/",
  };
};

export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;          // 15 min
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
