import api from "./axios";

export const registerUserRequest = (formData) =>
  api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const loginUserRequest = (payload) => api.post("/users/login", payload);

export const getProfileRequest = () => api.get("/users/profile");

export const logoutUserRequest = () => api.post("/users/logout");
