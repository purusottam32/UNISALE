import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { setStoredToken } from "../api/axios";
import { useAuth } from "../context/AuthContext";

/**
 * Captures ?token= from OAuth redirects, stores it, and refreshes the user profile.
 */
export default function OAuthTokenHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    setStoredToken(token);
    refreshProfile().finally(() => {
      const next = new URLSearchParams(searchParams);
      next.delete("token");
      setSearchParams(next, { replace: true });
    });
  }, [searchParams, setSearchParams, refreshProfile]);

  return null;
}
