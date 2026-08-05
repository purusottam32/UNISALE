"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

const STORAGE_KEY = "unisale.theme";

/**
 * Cycles light → dark → system.
 *
 * "System" is a real third state rather than an absence: a student who never
 * touches this should follow their phone's night mode, and one who explicitly
 * chose light at midnight should keep light.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    setTheme(window.localStorage.getItem(STORAGE_KEY) || "system");
  }, []);

  const apply = (next) => {
    setTheme(next);
    if (next === "system") {
      document.documentElement.removeAttribute("data-theme");
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label = `Theme: ${theme}. Switch to ${next}.`;

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink ${className || ""}`}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

/**
 * Applies the stored theme before first paint. Rendered in <head> as a blocking
 * inline script so the page never flashes light then snaps to dark.
 */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
