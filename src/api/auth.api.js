import api from "./axios";

// Auth
export const registerRequest = (payload) => api.post("/auth/register", payload);
export const verifyOtpRequest = (payload) => api.post("/auth/verify-otp", payload);
export const resendOtpRequest = (payload) => api.post("/auth/resend-otp", payload);
export const loginRequest = (payload) => api.post("/auth/login", payload);
export const logoutRequest = () => api.post("/auth/logout");
export const refreshTokenRequest = () => api.post("/auth/refresh");
export const getMeRequest = () => api.get("/auth/me");
export const updateMeRequest = (formData) =>
  api.patch("/auth/me", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const completeProfileRequest = (formData) =>
  api.post("/auth/complete-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Legacy aliases for backward-compat with existing components
export const getProfileRequest = getMeRequest;
export const loginUserRequest = loginRequest;
export const logoutUserRequest = logoutRequest;
export const registerUserRequest = registerRequest;
