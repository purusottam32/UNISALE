import api, { API_BASE_URL } from "@/lib/api-client";

export const registerRequest = (payload) => api.post("/auth/register", payload);
export const verifyOtpRequest = (payload) => api.post("/auth/verify-otp", payload);
export const resendOtpRequest = (payload) => api.post("/auth/resend-otp", payload);
export const loginRequest = (payload) => api.post("/auth/login", payload);
export const logoutRequest = () => api.post("/auth/logout");
export const getMeRequest = () => api.get("/auth/me");

export const updateMeRequest = (formData) =>
  api.patch("/auth/me", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const completeProfileRequest = (formData) =>
  api.post("/auth/complete-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Full-page redirect — the OAuth dance cannot happen inside XHR. */
export const googleAuthUrl = () => `${API_BASE_URL}/auth/google`;

export const updateNotificationPrefsRequest = (prefs) => api.patch("/users/me/notifications", prefs);
export const updateInterestsRequest = (interests) => api.patch("/users/me/interests", { interests });
export const deleteAccountRequest = () => api.delete("/users/me");
