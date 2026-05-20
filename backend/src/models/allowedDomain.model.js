import mongoose from "mongoose";

const allowedDomainSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // e.g. "iitb.ac.in", "bits-pilani.ac.in"
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

allowedDomainSchema.index({ isActive: 1 });

const AllowedDomain = mongoose.model("AllowedDomain", allowedDomainSchema);

export default AllowedDomain;
