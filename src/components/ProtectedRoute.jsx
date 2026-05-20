import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Requires authenticated + email verified.
 * Optionally requires profile complete.
 */
export default function ProtectedRoute({ children, requireComplete = false }) {
  const { isAuthenticated, isLoading, isEmailVerified, isProfileComplete } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isEmailVerified) return <Navigate to="/verify-otp" replace />;
  if (requireComplete && !isProfileComplete) return <Navigate to="/complete-profile" replace />;

  return children;
}
