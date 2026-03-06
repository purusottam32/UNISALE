import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Authentication required. Please login.", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("Server authentication configuration is invalid.", 500);
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired token.", 401);
  }

  const user = await User.findById(decodedToken.id).select("-password");

  if (!user) {
    throw new AppError("User for this token no longer exists.", 401);
  }

  req.user = user;
  next();
});
