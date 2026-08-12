"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

const STORAGE_KEY = "unisale.theme";

/**
 * Cycles dark → light → system.
 *
 * The product is dark-first: dark is what an unconfigured visitor gets,
 * regardless of what their OS prefers. So "system" is a real third state you
 * opt *into*, not the default — which means it has to be **written** to
 * storage. An absent key and an explicit "system" are different intentions
 * now, and the old implementation could not tell them apart because it
 * expressed "system" by deleting the key.
 *
 * Resolution lives in `ThemeScript` below rather than in CSS. That is what
 * lets `globals.css` declare each palette exactly once: CSS cannot read
 * `prefers-color-scheme` and also treat dark as the no-attribute default
 * without duplicating one of the two palettes.
 */
const ORDER = ["dark", "light", "system"];

const prefersLight = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: light)").matches;

/** The one place that decides what a stored choice means on the DOM. */
function paint(theme) {
  const light = theme === "light" || (theme === "system" && prefersLight());
  if (light) document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
}

export default function ThemeToggle({ className = "" }) {
  /* Initialises to "dark" — the default — so the icon does not flash for the
     majority of visitors on the first client render. */
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (ORDER.includes(stored)) setTheme(stored);
  }, []);

  /* While in "system", honour a live OS switch without a reload. */
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => paint("system");
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [theme]);

  const apply = (next) => {
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    paint(next);
  };

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const label = `Theme: ${theme}. Switch to ${next}.`;
  const Icon = theme === "light" ? Sun : theme === "system" ? Monitor : Moon;

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors duration-[--duration-fast] hover:bg-surface-2 hover:text-ink ${className || ""}`}
    >
      <Icon size={iconSize.md} strokeWidth={ICON_STROKE} />
    </button>
  );
}

/**
 * Applies the resolved theme before first paint. Rendered in <head> as a
 * blocking inline script so the page never flashes the wrong palette.
 *
 * Dark is the absence of `data-theme`, so this script only ever has to
 * decide whether to *add* the light flag. No stored key means dark, which is
 * why there is no work to do in the common case.
 */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||(t==="system"&&matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.setAttribute("data-theme","light")}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
