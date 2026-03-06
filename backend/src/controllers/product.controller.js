import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  searchProductsService,
} from "../services/product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService({
    body: req.body,
    files: req.files,
    sellerId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getProductsService(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const result = await searchProductsService(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id);

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService({
    productId: req.params.id,
    sellerId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});
