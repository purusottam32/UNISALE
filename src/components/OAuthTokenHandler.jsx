"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setStoredToken } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

export default function OAuthTokenHandler() {
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    setStoredToken(token);
    refreshProfile().finally(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("token");
      window.history.replaceState(null, "", `?${params.toString()}`);
    });
  }, [searchParams, refreshProfile]);

  return null;
}
