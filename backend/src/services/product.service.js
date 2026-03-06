import mongoose from "mongoose";
import Product, { PRODUCT_CATEGORIES } from "../models/product.model.js";
import AppError from "../utils/apiError.js";
import { deleteFromCloudinary, uploadBufferToCloudinary } from "../utils/cloudinary.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeCategory = (value) => {
  const input = String(value || "").trim().toLowerCase();
  const match = PRODUCT_CATEGORIES.find((category) => category.toLowerCase() === input);

  return match || "Others";
};

const buildProductFilters = (query = {}) => {
  const filters = {};
  const searchTerm = String(query.q || query.search || "").trim();

  if (query.category) {
    filters.category = new RegExp(`^${escapeRegex(String(query.category).trim())}$`, "i");
  }

  if (searchTerm) {
    const escapedSearchTerm = escapeRegex(searchTerm);
    filters.$or = [
      { title: { $regex: escapedSearchTerm, $options: "i" } },
      { description: { $regex: escapedSearchTerm, $options: "i" } },
      { category: { $regex: escapedSearchTerm, $options: "i" } },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filters.price = {};

    if (query.minPrice !== undefined) {
      const minPrice = Number(query.minPrice);
      if (!Number.isNaN(minPrice)) {
        filters.price.$gte = minPrice;
      }
    }

    if (query.maxPrice !== undefined) {
      const maxPrice = Number(query.maxPrice);
      if (!Number.isNaN(maxPrice)) {
        filters.price.$lte = maxPrice;
      }
    }

    if (Object.keys(filters.price).length === 0) {
      delete filters.price;
    }
  }

  return filters;
};

const normalizePagination = (query = {}) => {
  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);

  return {
    currentPage,
    limit,
    skip: (currentPage - 1) * limit,
  };
};

const buildPaginatedProductPayload = ({ products, totalItems, currentPage, limit }) => ({
  products,
  totalPages: Math.ceil(totalItems / limit) || 1,
  currentPage,
  totalItems,
  limit,
});

export const createProductService = async ({ body, files, sellerId }) => {
  if (!files || files.length === 0) {
    throw new AppError("At least one product image is required.", 400);
  }

  const price = Number(body.price);
  if (Number.isNaN(price) || price < 0) {
    throw new AppError("Price must be a number greater than or equal to 0.", 400);
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, "unisale/products"))
  );

  const images = uploadedImages.map((image) => ({
    url: image.secure_url,
    publicId: image.public_id,
  }));

  const product = await Product.create({
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    price,
    category: normalizeCategory(body.category),
    images,
    seller: sellerId,
  });

  return product;
};

export const getProductsService = async (query = {}) => {
  const filters = buildProductFilters(query);
  const { currentPage, limit, skip } = normalizePagination(query);

  const allowedSortFields = ["createdAt", "price", "title"];
  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  const [products, totalItems] = await Promise.all([
    Product.find(filters)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("seller", "name email avatar createdAt"),
    Product.countDocuments(filters),
  ]);

  return buildPaginatedProductPayload({
    products,
    totalItems,
    currentPage,
    limit,
  });
};

export const searchProductsService = async (query = {}) => {
  const searchTerm = String(query.q || "").trim();

  if (!searchTerm) {
    throw new AppError("Search query parameter 'q' is required.", 400);
  }

  return getProductsService({
    ...query,
    q: searchTerm,
    sortBy: query.sortBy || "createdAt",
    sortOrder: query.sortOrder || "desc",
  });
};

export const getProductByIdService = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid product id.", 400);
  }

  const product = await Product.findById(productId).populate(
    "seller",
    "name email avatar createdAt"
  );

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  return product;
};

export const getProductsBySellerIdService = async ({ sellerId, query = {} }) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const { currentPage, limit, skip } = normalizePagination(query);

  const [products, totalItems] = await Promise.all([
    Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("seller", "name email avatar createdAt"),
    Product.countDocuments({ seller: sellerId }),
  ]);

  return buildPaginatedProductPayload({
    products,
    totalItems,
    currentPage,
    limit,
  });
};

export const deleteProductService = async ({ productId, sellerId }) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  if (product.seller.toString() !== sellerId.toString()) {
    throw new AppError("You can only delete your own product.", 403);
  }

  await Promise.all(
    product.images.map((image) => deleteFromCloudinary(image.publicId).catch(() => null))
  );

  await product.deleteOne();
};
