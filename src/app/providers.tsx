"use client";

import { Suspense, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/features/auth/auth-context";
import OAuthTokenHandler from "@/features/auth/components/OAuthTokenHandler";
import { SocketProvider } from "@/features/chat/socket-provider";
import MotionProvider from "@/components/providers/MotionProvider";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { ToastViewport } from "@/components/ui/Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  // One client per browser session, created lazily so an SSR render never
  // shares a cache between requests.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        {/* One delay for every tooltip in the app — 400ms is long enough that
            a cursor crossing the screen doesn't trigger a trail of them. */}
        <TooltipProvider delayDuration={400} skipDelayDuration={200}>
          <AuthProvider>
            <SocketProvider>
              <Suspense fallback={null}>
                <OAuthTokenHandler />
              </Suspense>

              {children}

              <ToastViewport />
            </SocketProvider>
          </AuthProvider>
        </TooltipProvider>
      </MotionProvider>
    </QueryClientProvider>
  );
}
