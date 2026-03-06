import asyncHandler from "../utils/asyncHandler.js";
import {
  getAuthCookieOptions,
  getClearCookieOptions,
  getProfileService,
  getUserProductsService,
  loginUserService,
  registerUserService,
} from "../services/user.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await registerUserService({
    name,
    email,
    password,
    avatarFile: req.file,
  });

  res.cookie("token", token, getAuthCookieOptions());

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: {
      user,
      token,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginUserService({ email, password });

  res.cookie("token", token, getAuthCookieOptions());

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user,
      token,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", getClearCookieOptions());

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getProfileService(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const getUserProducts = asyncHandler(async (req, res) => {
  const result = await getUserProductsService({
    userId: req.params.id,
    query: req.query,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
