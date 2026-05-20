import {
  getListingsRequest,
  searchListingsRequest,
  getListingByIdRequest,
  createListingRequest,
  updateListingRequest,
  updateListingStatusRequest,
  deleteListingRequest,
} from "./listings.api";

export const getProductsRequest = getListingsRequest;
export const searchProductsRequest = searchListingsRequest;
export const getProductByIdRequest = getListingByIdRequest;
export const createProductRequest = createListingRequest;
export const updateProductRequest = updateListingRequest;
export const updateProductStatusRequest = updateListingStatusRequest;
export const deleteProductRequest = deleteListingRequest;
