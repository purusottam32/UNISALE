/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfileRequest,
  loginUserRequest,
  logoutUserRequest,
  registerUserRequest,
} from "../api/auth.api";
import { queryKeys } from "../api/queryKeys";

const AuthContext = createContext(null);
const TOKEN_KEY = "unisale_token";

const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile,
    retry: false,
    queryFn: async () => {
      try {
        const response = await getProfileRequest();
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

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await registerUserRequest(formData);
      return response.data?.data || {};
    },
    onSuccess: (payload) => {
      if (payload.token) {
        setStoredToken(payload.token);
      }

      queryClient.setQueryData(queryKeys.auth.profile, payload.user || null);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await loginUserRequest(credentials);
      return response.data?.data || {};
    },
    onSuccess: (payload) => {
      if (payload.token) {
        setStoredToken(payload.token);
      }

      queryClient.setQueryData(queryKeys.auth.profile, payload.user || null);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutUserRequest(),
    onSettled: () => {
      setStoredToken(null);
      queryClient.setQueryData(queryKeys.auth.profile, null);
    },
  });

  const register = async (formData) => {
    const payload = await registerMutation.mutateAsync(formData);
    return payload.user;
  };

  const login = async (credentials) => {
    const payload = await loginMutation.mutateAsync(credentials);
    return payload.user;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refreshProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
  };

  const isLoading =
    profileQuery.isLoading ||
    registerMutation.isPending ||
    loginMutation.isPending ||
    logoutMutation.isPending;

  const value = {
    user: profileQuery.data || null,
    isLoading,
    isAuthenticated: Boolean(profileQuery.data),
    register,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
