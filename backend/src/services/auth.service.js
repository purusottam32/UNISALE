import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import AllowedDomain from "../models/allowedDomain.model.js";
import AppError from "../utils/apiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  cookieOptions,
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from "../utils/tokens.js";
import { sendOTPEmail } from "../utils/email.js";
import { uploadImageToR2 } from "../utils/r2.js";

// ---------------------
// Helpers
// ---------------------

/**
 * Validates that the email domain is in the AllowedDomain whitelist.
 */
const validateCollegeDomain = async (email) => {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) throw new AppError("Invalid email format.", 400);

  const allowed = await AllowedDomain.findOne({ domain, isActive: true });
  if (!allowed) {
    throw new AppError(
      `The email domain "@${domain}" is not registered as a college domain on UniSale. Contact support if your institution should be listed.`,
      403
    );
  }

  return { domain, collegeName: allowed.collegeName };
};

/**
 * Issues access + refresh tokens, stores hashed refresh token, sets cookies.
 */
const issueTokens = async (user, res) => {
  const payload = { id: user._id.toString(), role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store refresh token on user (for rotation / revocation)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set HttpOnly cookies
  res.cookie("accessToken", accessToken, cookieOptions(ACCESS_TOKEN_TTL_MS));
  res.cookie("refreshToken", refreshToken, cookieOptions(REFRESH_TOKEN_TTL_MS));

  return { accessToken, refreshToken };
};

/**
 * The shape of the signed-in user returned to the client. This is the *own*
 * user view — it includes the email and role that `toPublicProfile` in
 * user.service.js deliberately withholds from other students.
 */
const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username || "",
  email: user.email,
  avatar: user.avatar?.url || "",
  college: user.college || "",
  department: user.department || "",
  year: user.year || null,
  bio: user.bio || "",
  interests: user.interests || [],
  role: user.role,
  ratingAverage: user.ratingAverage || 0,
  ratingCount: user.ratingCount || 0,
  completedDeals: user.completedDeals || 0,
  isEmailVerified: user.isEmailVerified,
  isProfileComplete: user.isProfileComplete,
  isIdVerified: user.isIdVerified,
  trustScore: user.trustScore,
  trustTier: user.trustTier,
  notificationPrefs: user.notificationPrefs,
  createdAt: user.createdAt,
});

// ---------------------
// Service Functions
// ---------------------

/**
 * STEP 1: Register — create unverified account, send OTP.
 */
export const registerService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  await validateCollegeDomain(normalizedEmail);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    if (existing.isEmailVerified) {
      throw new AppError("An account with this email already exists.", 409);
    }
    // Resend OTP if account exists but not verified
    const otp = await OTP.createForEmail(normalizedEmail);
    await sendOTPEmail({ to: normalizedEmail, otp, name: existing.name });
    return { message: "Account already exists. A new OTP has been sent to your email." };
  }

  await User.create({ name: name.trim(), email: normalizedEmail, password });

  const otp = await OTP.createForEmail(normalizedEmail);
  await sendOTPEmail({ to: normalizedEmail, otp, name: name.trim() });

  return { message: "Account created. Please check your email for the OTP." };
};

/**
 * STEP 2: Verify OTP — mark email verified.
 */
export const verifyOtpService = async ({ email, otp }, res) => {
  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await OTP.findOne({ email: normalizedEmail }).select("+hashedOtp");
  if (!otpRecord) {
    throw new AppError("No OTP found for this email. Please register or request a new OTP.", 404);
  }

  const { valid, reason } = await otpRecord.verify(otp);
  if (!valid) throw new AppError(reason, 400);

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { isEmailVerified: true },
    { new: true }
  );

  if (!user) throw new AppError("User not found.", 404);

  const tokens = await issueTokens(user, res);

  return {
    message: "Email verified successfully.",
    user: toPublicUser(user),
    accessToken: tokens.accessToken,
  };
};

/**
 * Resend OTP (rate-limited by OTP model).
 */
export const resendOtpService = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();

  await validateCollegeDomain(normalizedEmail);

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new AppError("No account found with this email.", 404);
  if (user.isEmailVerified) throw new AppError("This email is already verified.", 400);

  const otp = await OTP.createForEmail(normalizedEmail);
  await sendOTPEmail({ to: normalizedEmail, otp, name: user.name });

  return { message: "A new OTP has been sent to your email." };
};

/**
 * Login with email + password.
 */
export const loginService = async ({ email, password }, res) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) throw new AppError("Invalid email or password.", 401);

  if (!user.password) {
    throw new AppError("This account was created with Google. Please login with Google.", 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password.", 401);

  if (user.isBanned) throw new AppError("Your account has been suspended.", 403);

  if (!user.isEmailVerified) {
    // Re-send OTP automatically
    const otp = await OTP.createForEmail(normalizedEmail);
    await sendOTPEmail({ to: normalizedEmail, otp, name: user.name });
    throw new AppError(
      "Email not verified. A new OTP has been sent to your email.",
      403
    );
  }

  const freshUser = await User.findById(user._id);
  const tokens = await issueTokens(freshUser, res);

  return {
    user: toPublicUser(freshUser),
    accessToken: tokens.accessToken,
  };
};

/**
 * Logout — clear tokens.
 */
export const logoutService = async (userId, res) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  const clearOptions = { httpOnly: true, path: "/" };
  res.clearCookie("accessToken", clearOptions);
  res.clearCookie("refreshToken", clearOptions);

  return { message: "Logged out successfully." };
};

/**
 * Refresh access token using refresh token.
 */
export const refreshTokenService = async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) throw new AppError("Refresh token not provided.", 401);

  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw new AppError("Refresh token is invalid or has been rotated.", 401);
  }

  if (user.isBanned) throw new AppError("Your account has been suspended.", 403);

  const tokens = await issueTokens(user, res); // rotates refresh token

  return { accessToken: tokens.accessToken };
};

/**
 * Google OAuth — find or create user.
 */
export const googleAuthService = async ({ googleId, email, name, avatarUrl }, res) => {
  const normalizedEmail = email.toLowerCase().trim();

  let user = await User.findOne({ $or: [{ googleId }, { email: normalizedEmail }] });

  if (user) {
    // Link Google ID if not already linked
    if (!user.googleId) {
      user.googleId = googleId;
      user.isEmailVerified = true;
    }
    if (user.isBanned) throw new AppError("Your account has been suspended.", 403);
  } else {
    // Validate domain
    await validateCollegeDomain(normalizedEmail);

    user = await User.create({
      googleId,
      name,
      email: normalizedEmail,
      isEmailVerified: true,
      avatar: { url: avatarUrl || "", key: "" },
    });
  }

  await user.save({ validateBeforeSave: false });
  const tokens = await issueTokens(user, res);

  return {
    user: toPublicUser(user),
    accessToken: tokens.accessToken,
    isNewUser: !user.isProfileComplete,
  };
};

/**
 * Complete profile after email verification.
 */
export const completeProfileService = async (
  userId,
  { username, college, department, year, bio, interests, avatarFile }
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  if (username) {
    const normalizedUsername = username.toLowerCase().trim();
    const taken = await User.findOne({ username: normalizedUsername, _id: { $ne: userId } });
    if (taken) throw new AppError("This username is already taken.", 409);
    user.username = normalizedUsername;
  }

  user.college = college;
  user.department = department;
  user.year = year;
  if (bio !== undefined) user.bio = bio;
  // Seeds feed personalisation on day one, before any behavioural signal exists.
  if (Array.isArray(interests)) user.interests = interests.slice(0, 6);

  if (avatarFile?.buffer) {
    const { url, key } = await uploadImageToR2(avatarFile.buffer, "avatars");
    user.avatar = { url, key };
  }

  user.isProfileComplete = user.checkProfileComplete();

  await user.save({ validateBeforeSave: false });

  return toPublicUser(user);
};

/**
 * Get current user profile.
 */
export const getMeService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);
  return toPublicUser(user);
};

/**
 * Update profile fields.
 */
export const updateMeService = async (userId, updates, avatarFile) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const { college, department, year, bio, name, interests } = updates;

  if (name !== undefined) user.name = name;
  if (college !== undefined) user.college = college;
  if (department !== undefined) user.department = department;
  if (year !== undefined) user.year = year;
  if (bio !== undefined) user.bio = bio;
  if (Array.isArray(interests)) user.interests = interests.slice(0, 6);

  if (avatarFile?.buffer) {
    const { url, key } = await uploadImageToR2(avatarFile.buffer, "avatars");
    user.avatar = { url, key };
  }

  user.isProfileComplete = user.checkProfileComplete();

  await user.save({ validateBeforeSave: false });

  return toPublicUser(user);
};
