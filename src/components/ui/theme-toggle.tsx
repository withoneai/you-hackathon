"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useLayoutEffect } from "react";

const STORAGE_KEY = "theme";

/**
 * Runs in <head> before the first paint: the saved choice, else the system setting.
 * Kept as a string so layout.tsx can inline it.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

function applyTheme() {
  try {
    let theme = localStorage.getItem(STORAGE_KEY);
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch {}
}

/** Light / dark switch. The icon follows `data-theme` through CSS, so it never mismatches on hydration. */
export function ThemeToggle() {
  // React's dev remount clears the attribute the head script set; put it back. A no-op in production.
  useLayoutEffect(applyTheme, []);

  function toggle() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="inline-flex h-9 w-9 items-center justify-center rounded-control text-secondary transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-spring/30"
    >
      <Moon size={17} className="dark:hidden" />
      <Sun size={17} className="hidden dark:block" />
    </button>
  );
}
