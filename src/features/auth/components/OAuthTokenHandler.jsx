"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredToken } from "@/lib/api-client";
import { useAuth } from "../auth-context";

/**
 * The Google callback bounces back to the app with `?token=…`. Store it, drop
 * it from the URL so it never lands in history or a shared link, then refetch
 * the profile so the shell renders as signed in.
 */
export default function OAuthTokenHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    setStoredToken(token);
    refreshProfile();

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("token");
    const query = params.toString();
    router.replace(`${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [searchParams, router, refreshProfile]);

  return null;
}
