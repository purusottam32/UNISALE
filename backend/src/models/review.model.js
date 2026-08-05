import mongoose from "mongoose";

/**
 * A mutual, post-transaction rating. Both parties of a completed deal may leave
 * exactly one review of the other for that listing — the compound unique index
 * below is what enforces "one review per person per deal".
 */
const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    /** Who wrote the review. */
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** Who is being reviewed. */
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** Role the *subject* played in the transaction. */
    role: {
      type: String,
      enum: ["seller", "buyer"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ listing: 1, author: 1 }, { unique: true });
reviewSchema.index({ subject: 1, createdAt: -1 });

/**
 * Recomputes and persists the denormalised rating fields on the subject's
 * user document. Called after every review write.
 */
reviewSchema.statics.syncSubjectRating = async function syncSubjectRating(subjectId) {
  const [summary] = await this.aggregate([
    { $match: { subject: new mongoose.Types.ObjectId(String(subjectId)) } },
    {
      $group: {
        _id: "$subject",
        ratingAverage: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  const User = mongoose.model("User");
  await User.findByIdAndUpdate(subjectId, {
    ratingAverage: summary ? Math.round(summary.ratingAverage * 10) / 10 : 0,
    ratingCount: summary ? summary.ratingCount : 0,
  });

  return summary || { ratingAverage: 0, ratingCount: 0 };
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
