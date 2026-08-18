"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/States";

/**
 * Route-level error boundary.
 *
 * Without this file a thrown render error anywhere in the tree unmounts the
 * whole app and leaves the user on a blank page in production — no chrome, no
 * navigation, no way back. Next only recovers a route segment if the segment
 * provides this boundary, so it lives at the root and covers every group.
 *
 * `reset()` re-renders the segment, which is the right first move for the
 * common cause (a transient fetch or serialisation failure). The secondary
 * action goes to `/explore` rather than `/` because a signed-in user bounced
 * to the marketing page reads as being logged out.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only handle on the server-side stack in production.
    console.error("[unisale] route error", error.digest ?? "", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-xl py-10">
      <ErrorState
        title="This page didn't load"
        description="Something broke on our side, not yours. Try again — if it keeps happening, the rest of UniSale still works."
        onRetry={reset}
        action={{ label: "Browse listings", href: "/explore" }}
      />
    </div>
  );
}
