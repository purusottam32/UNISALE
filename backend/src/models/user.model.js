import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { LISTING_CATEGORIES, TRUST_SIGNALS, TRUST_TIERS } from "../config/constants.js";

const avatarSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    key: { type: String, default: "" }, // R2 object key, needed for deletion
  },
  { _id: false }
);

/**
 * Per-channel notification preferences. Defaults are opt-in for transactional
 * events and opt-out for anything marketing-adjacent.
 */
const notificationPrefsSchema = new mongoose.Schema(
  {
    messageEmail: { type: Boolean, default: true },
    messagePush: { type: Boolean, default: true },
    priceDropEmail: { type: Boolean, default: true },
    reviewEmail: { type: Boolean, default: true },
    campusDigest: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      sparse: true,
      select: false,
    },
    avatar: {
      type: avatarSchema,
      default: () => ({}),
    },

    // ── Campus profile ───────────────────────────────────────────────
    college: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    year: { type: Number, min: 1, max: 6, default: null },
    bio: { type: String, trim: true, maxlength: 160, default: "" },

    /**
     * Categories the user picked during onboarding. Used to personalise the
     * campus feed before we have enough behavioural signal (cold-start fix).
     */
    interests: {
      type: [{ type: String, enum: LISTING_CATEGORIES }],
      default: [],
    },

    // ── Reputation (denormalised, recomputed on every new review) ─────
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    completedDeals: { type: Number, default: 0, min: 0 },

    // ── Auth & status ────────────────────────────────────────────────
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isIdVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },

    notificationPrefs: {
      type: notificationPrefsSchema,
      default: () => ({}),
    },

    lastActiveAt: { type: Date, default: Date.now },

    // Rotated refresh token — never returned by default.
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────────────────────
userSchema.index({ college: 1 });
userSchema.index({ role: 1 });
userSchema.index({ ratingAverage: -1 });

// ── Hooks ──────────────────────────────────────────────────────────────
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance methods ───────────────────────────────────────────────────
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkProfileComplete = function checkProfileComplete() {
  return Boolean(this.college && this.department && this.year);
};

// ── Virtuals ───────────────────────────────────────────────────────────
userSchema.virtual("avatarUrl").get(function avatarUrl() {
  return this.avatar?.url || "";
});

/**
 * Trust score (0-100) per PRD §10.2. Computed rather than stored so it can
 * never drift out of sync with the signals that feed it.
 */
userSchema.virtual("trustScore").get(function trustScore() {
  let score = 0;
  if (this.isEmailVerified) score += TRUST_SIGNALS.emailVerified;
  if (this.isIdVerified) score += TRUST_SIGNALS.idVerified;
  if (this.isProfileComplete && this.avatar?.url && this.bio) {
    score += TRUST_SIGNALS.profileComplete;
  }
  if (this.ratingCount >= 3 && this.ratingAverage >= 4) score += TRUST_SIGNALS.goodRating;

  const ageDays = (Date.now() - new Date(this.createdAt || Date.now()).getTime()) / 86_400_000;
  if (ageDays > 90) score += TRUST_SIGNALS.accountAge;
  if (!this.isBanned) score += TRUST_SIGNALS.cleanRecord;

  return Math.min(score, 100);
});

userSchema.virtual("trustTier").get(function trustTier() {
  const score = this.trustScore;
  return TRUST_TIERS.find((tier) => score >= tier.min) || TRUST_TIERS[TRUST_TIERS.length - 1];
});

const User = mongoose.model("User", userSchema);

export default User;
