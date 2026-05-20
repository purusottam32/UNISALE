import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const OTP_EXPIRES_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  hashedOtp: {
    type: String,
    required: true,
    select: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000),
    index: { expireAfterSeconds: 0 }, // MongoDB TTL — auto-delete
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

otpSchema.statics.createForEmail = async function (email) {
  // Remove any existing OTP for this email
  await this.deleteMany({ email: email.toLowerCase().trim() });

  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
  const hashedOtp = await bcrypt.hash(otp, 10);

  await this.create({ email: email.toLowerCase().trim(), hashedOtp });

  return otp; // Return plain OTP once — caller sends it via email
};

otpSchema.methods.verify = async function (candidateOtp) {
  if (this.attempts >= MAX_ATTEMPTS) {
    return { valid: false, reason: "Too many attempts. Request a new OTP." };
  }

  if (new Date() > this.expiresAt) {
    return { valid: false, reason: "OTP has expired." };
  }

  this.attempts += 1;
  await this.save();

  const isMatch = await bcrypt.compare(String(candidateOtp), this.hashedOtp);
  if (!isMatch) {
    return { valid: false, reason: "Incorrect OTP." };
  }

  // Consume OTP on success
  await this.deleteOne();
  return { valid: true };
};

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
