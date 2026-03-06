import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
  "Books",
  "Electronics",
  "Hostel Essentials",
  "Notes",
  "Furniture",
  "Others",
];

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: PRODUCT_CATEGORIES,
      default: "Others",
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: "text", description: "text", category: "text" });
productSchema.index({ category: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
