"use client";

import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import OAuthTokenHandler from "@/components/OAuthTokenHandler";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={null}>
          <OAuthTokenHandler />
        </Suspense>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--color-surface-2)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
            },
            success: {
              iconTheme: { primary: "var(--color-success)", secondary: "transparent" },
            },
            error: {
              iconTheme: { primary: "var(--color-error)", secondary: "transparent" },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
