/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  verifyOtpRequest,
  resendOtpRequest,
  completeProfileRequest,
  updateMeRequest,
} from "../api/auth.api";
import { setStoredToken, setAuthFailureHandler } from "../api/axios";
import { queryKeys } from "../api/queryKeys";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthFailureHandler(() => {
      setStoredToken(null);
      queryClient.setQueryData(queryKeys.auth.profile, null);
    });
    return () => setAuthFailureHandler(null);
  }, [queryClient]);

  // ---------------------
  // Fetch current user
  // ---------------------
  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
    queryFn: async () => {
      try {
        const response = await getMeRequest();
        return response.data?.data || null;
      } catch (error) {
        if (error?.response?.status === 401) {
          setStoredToken(null);
          return null;
        }
        throw error;
      }
    },
  });

  // ---------------------
  // Mutations
  // ---------------------
  const registerMutation = useMutation({
    mutationFn: (payload) => registerRequest(payload),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload) => verifyOtpRequest(payload),
    onSuccess: (response) => {
      const data = response.data;
      if (data?.accessToken) setStoredToken(data.accessToken);
      if (data?.user) queryClient.setQueryData(queryKeys.auth.profile, data.user);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (payload) => resendOtpRequest(payload),
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => loginRequest(credentials),
    onSuccess: (response) => {
      const data = response.data;
      if (data?.accessToken) setStoredToken(data.accessToken);
      if (data?.user) queryClient.setQueryData(queryKeys.auth.profile, data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      setStoredToken(null);
      queryClient.setQueryData(queryKeys.auth.profile, null);
      queryClient.clear();
    },
  });

  const completeProfileMutation = useMutation({
    mutationFn: (formData) => completeProfileRequest(formData),
    onSuccess: (response) => {
      const user = response.data?.data;
      if (user) queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });

  const updateMeMutation = useMutation({
    mutationFn: (formData) => updateMeRequest(formData),
    onSuccess: (response) => {
      const user = response.data?.data;
      if (user) queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });

  // ---------------------
  // Exposed API
  // ---------------------
  const register = useCallback(async (payload) => {
    const response = await registerMutation.mutateAsync(payload);
    return response.data;
  }, [registerMutation]);

  const verifyOtp = useCallback(async (payload) => {
    const response = await verifyOtpMutation.mutateAsync(payload);
    return response.data;
  }, [verifyOtpMutation]);

  const resendOtp = useCallback(async (payload) => {
    const response = await resendOtpMutation.mutateAsync(payload);
    return response.data;
  }, [resendOtpMutation]);

  const login = useCallback(async (credentials) => {
    const response = await loginMutation.mutateAsync(credentials);
    return response.data;
  }, [loginMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const completeProfile = useCallback(async (formData) => {
    const response = await completeProfileMutation.mutateAsync(formData);
    return response.data?.data;
  }, [completeProfileMutation]);

  const updateMe = useCallback(async (formData) => {
    const response = await updateMeMutation.mutateAsync(formData);
    return response.data?.data;
  }, [updateMeMutation]);

  const refreshProfile = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
  }, [queryClient]);

  const isLoading =
    profileQuery.isLoading ||
    loginMutation.isPending ||
    logoutMutation.isPending;

  const value = {
    // State
    user: profileQuery.data || null,
    isLoading,
    isAuthenticated: Boolean(profileQuery.data),
    isEmailVerified: profileQuery.data?.isEmailVerified || false,
    isProfileComplete: profileQuery.data?.isProfileComplete || false,
    isAdmin: profileQuery.data?.role === "admin",
    // Actions
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    completeProfile,
    updateMe,
    refreshProfile,
    // Mutation states (for form loading indicators)
    registerPending: registerMutation.isPending,
    verifyOtpPending: verifyOtpMutation.isPending,
    loginPending: loginMutation.isPending,
    completeProfilePending: completeProfileMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
};
