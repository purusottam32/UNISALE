import api from "./axios";

export const getListingsRequest = (params = {}) => api.get("/listings", { params });

export const searchListingsRequest = (params = {}) => api.get("/search", { params });

export const getListingByIdRequest = (id) => api.get(`/listings/${id}`);

export const createListingRequest = (formData) =>
  api.post("/listings", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateListingRequest = (id, formData) =>
  api.patch(`/listings/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateListingStatusRequest = (id, status) =>
  api.patch(`/listings/${id}/status`, { status });

export const deleteListingRequest = (id) => api.delete(`/listings/${id}`);
