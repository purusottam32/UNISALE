import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const avatarSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    key: { type: String, default: "" }, // R2 object key for deletion
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
    // Profile fields
    college: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: Number,
      min: 1,
      max: 6,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    // Auth & Status
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    // Refresh token stored for rotation / revocation
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ---------------------
// Indexes
// ---------------------
userSchema.index({ college: 1 });
userSchema.index({ role: 1 });

// ---------------------
// Hooks
// ---------------------
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ---------------------
// Instance Methods
// ---------------------
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkProfileComplete = function checkProfileComplete() {
  return Boolean(this.college && this.department && this.year);
};

// ---------------------
// Virtuals
// ---------------------
userSchema.virtual("avatarUrl").get(function () {
  return this.avatar?.url || "";
});

const User = mongoose.model("User", userSchema);

export default User;
