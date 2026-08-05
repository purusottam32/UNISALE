"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setAuthFailureHandler, setStoredToken } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import {
  completeProfileRequest,
  getMeRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  resendOtpRequest,
  updateMeRequest,
  verifyOtpRequest,
} from "./api";

/**
 * Typed for `.tsx` consumers. `createContext(null)` alone infers
 * `Context<null>`, which makes `useAuth()` return `never` everywhere.
 *
 * @type {import("react").Context<import("./types").AuthContextValue | null>}
 */
const AuthContext = createContext(null);

/**
 * Session state for the whole app.
 *
 * The signed-in user is a React Query entry rather than component state, so any
 * mutation that returns a fresh user (profile edit, onboarding, avatar upload)
 * can write straight into the cache and every consumer re-renders at once.
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthFailureHandler(() => {
      setStoredToken(null);
      queryClient.setQueryData(queryKeys.auth.profile, null);
    });
    return () => setAuthFailureHandler(null);
  }, [queryClient]);

  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile,
    retry: false,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      try {
        const response = await getMeRequest();
        return response.data?.data || null;
      } catch (error) {
        // 401 here means "not signed in", which is a valid state, not a failure.
        if (error?.response?.status === 401) {
          setStoredToken(null);
          return null;
        }
        throw error;
      }
    },
  });

  const setSession = useCallback(
    (payload) => {
      if (payload?.accessToken) setStoredToken(payload.accessToken);
      if (payload?.user) queryClient.setQueryData(queryKeys.auth.profile, payload.user);
    },
    [queryClient]
  );

  const registerMutation = useMutation({ mutationFn: registerRequest });
  const resendOtpMutation = useMutation({ mutationFn: resendOtpRequest });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpRequest,
    onSuccess: (response) => setSession(response.data),
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => setSession(response.data),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      setStoredToken(null);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth.profile, null);
    },
  });

  const completeProfileMutation = useMutation({
    mutationFn: completeProfileRequest,
    onSuccess: (response) => {
      const user = response.data?.data;
      if (user) queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });

  const updateMeMutation = useMutation({
    mutationFn: updateMeRequest,
    onSuccess: (response) => {
      const user = response.data?.data;
      if (user) queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });

  /**
   * Annotated so TypeScript consumers get a real shape across the JS/TS
   * boundary — without it `user` infers as `never` and every `user?.field`
   * read in a .tsx file fails to compile.
   *
   * @type {import("./types").CurrentUser | null}
   */
  const user = profileQuery.data || null;

  const value = useMemo(
    () => ({
      user,
      isLoading: profileQuery.isLoading,
      isAuthenticated: Boolean(user),
      isEmailVerified: Boolean(user?.isEmailVerified),
      isProfileComplete: Boolean(user?.isProfileComplete),
      isAdmin: user?.role === "admin",

      register: (payload) => registerMutation.mutateAsync(payload).then((r) => r.data),
      verifyOtp: (payload) => verifyOtpMutation.mutateAsync(payload).then((r) => r.data),
      resendOtp: (payload) => resendOtpMutation.mutateAsync(payload).then((r) => r.data),
      login: (payload) => loginMutation.mutateAsync(payload).then((r) => r.data),
      logout: () => logoutMutation.mutateAsync(),
      completeProfile: (formData) =>
        completeProfileMutation.mutateAsync(formData).then((r) => r.data?.data),
      updateMe: (formData) => updateMeMutation.mutateAsync(formData).then((r) => r.data?.data),
      adoptSession: setSession,
      refreshProfile: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile }),

      pending: {
        register: registerMutation.isPending,
        verifyOtp: verifyOtpMutation.isPending,
        login: loginMutation.isPending,
        completeProfile: completeProfileMutation.isPending,
        updateMe: updateMeMutation.isPending,
        logout: logoutMutation.isPending,
      },
    }),
    [
      user,
      profileQuery.isLoading,
      registerMutation,
      verifyOtpMutation,
      resendOtpMutation,
      loginMutation,
      logoutMutation,
      completeProfileMutation,
      updateMeMutation,
      setSession,
      queryClient,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>.");
  return context;
}
