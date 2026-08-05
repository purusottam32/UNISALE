import api from "@/lib/api-client";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const getListingsRequest = (params = {}) => api.get("/listings", { params });
export const getFeedRequest = (params = {}) => api.get("/listings/feed", { params });
export const getTrendingRequest = (params = {}) => api.get("/listings/trending", { params });
export const searchListingsRequest = (params = {}) => api.get("/listings/search", { params });

export const getListingRequest = (id) => api.get(`/listings/${id}`);
export const getSimilarRequest = (id, params = {}) => api.get(`/listings/${id}/similar`, { params });

export const createListingRequest = (formData) => api.post("/listings", formData, multipart);
export const updateListingRequest = (id, formData) =>
  api.patch(`/listings/${id}`, formData, multipart);

export const updateListingStatusRequest = (id, payload) =>
  api.patch(`/listings/${id}/status`, payload);

export const deleteListingRequest = (id) => api.delete(`/listings/${id}`);
export const reportListingRequest = (id, reason) => api.post(`/listings/${id}/report`, { reason });

export const getUserListingsRequest = (userId, params = {}) =>
  api.get(`/users/${userId}/listings`, { params });
