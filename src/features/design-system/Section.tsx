"use client";

import { motion } from "framer-motion";
import { revealOnScroll } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Reveal-on-scroll section wrapper used throughout the style guide. */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section id={id} className="scroll-mt-24 py-14 md:py-20" {...revealOnScroll}>
      <header className="mb-8 max-w-2xl">
        <h2 className="text-display-md text-ink">{title}</h2>
        {description && <p className="mt-2 text-body text-muted">{description}</p>}
      </header>
      {children}
    </motion.section>
  );
}

/** Label + monospace value, the caption under every specimen. */
export function Spec({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-caption text-muted">
      {label} <span className="tabular text-ink-2">{value}</span>
    </p>
  );
}

export function Grid({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}
