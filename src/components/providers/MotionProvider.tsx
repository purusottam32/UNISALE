"use client";

import { MotionConfig } from "framer-motion";
import { transitions } from "@/lib/motion";

/**
 * Global motion configuration.
 *
 * `reducedMotion="user"` makes Framer honour the OS setting for every
 * animation in the tree — transforms and opacity are skipped while layout
 * animations still resolve to their final position. Handling it once here
 * means no component ever has to branch on the preference, and none of them
 * can forget to.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={transitions.base}>
      {children}
    </MotionConfig>
  );
}
