import api from "./axios";

export const getUserProductsRequest = (userId, params = {}) =>
  api.get(`/users/${userId}/products`, { params });
