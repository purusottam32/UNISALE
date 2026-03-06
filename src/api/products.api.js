import api from "./axios";

export const getProductsRequest = (params = {}) => api.get("/products", { params });

export const searchProductsRequest = (params = {}) => api.get("/products/search", { params });

export const getProductByIdRequest = (id) => api.get(`/products/${id}`);

export const createProductRequest = (formData) =>
  api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProductRequest = (id) => api.delete(`/products/${id}`);
