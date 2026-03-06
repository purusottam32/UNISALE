import api from "./axios";

export const addToWishlistRequest = (productId) =>
  api.post("/wishlist/add", {
    productId,
  });

export const getWishlistRequest = () => api.get("/wishlist");

export const removeFromWishlistRequest = (productId) =>
  api.delete(`/wishlist/${productId}`);
