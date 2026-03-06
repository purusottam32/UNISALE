import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import AppError from "../utils/apiError.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar?.url || "",
  createdAt: user.createdAt,
});

export const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: SESSION_DURATION_MS,
    path: "/",
  };
};

export const getClearCookieOptions = () => {
  const options = getAuthCookieOptions();
  delete options.maxAge;

  return options;
};

export const registerUserService = async ({ name, email, password, avatarFile }) => {
  const normalizedEmail = String(email).toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
  }

  let avatar = {
    url: "",
    publicId: "",
  };

  if (avatarFile?.buffer) {
    const uploadedAvatar = await uploadBufferToCloudinary(avatarFile.buffer, "unisale/avatars");
    avatar = {
      url: uploadedAvatar.secure_url,
      publicId: uploadedAvatar.public_id,
    };
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    avatar,
  });

  const token = user.generateAuthToken();

  return {
    user: toPublicUser(user),
    token,
  };
};

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = String(email).toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = user.generateAuthToken();

  const fullUser = await User.findById(user._id);

  return {
    user: toPublicUser(fullUser),
    token,
  };
};

export const getProfileService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return toPublicUser(user);
};

export const getUserProductsService = async ({ userId, query = {} }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (currentPage - 1) * limit;

  const [products, totalItems] = await Promise.all([
    Product.find({ seller: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("seller", "name email avatar createdAt"),
    Product.countDocuments({ seller: userId }),
  ]);

  return {
    user: toPublicUser(user),
    products,
    totalPages: Math.ceil(totalItems / limit) || 1,
    currentPage,
    totalItems,
    limit,
  };
};
