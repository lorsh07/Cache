import { useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "cache.theme";

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "light" || stored === "dark" ? stored : "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const isDark = mode === "dark" || (mode === "system" && systemPrefersDark());
      root.classList.toggle("dark", isDark);
    };
    applyTheme();

    if (mode === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", applyTheme);
      return () => mql.removeEventListener("change", applyTheme);
    }
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // storage unavailable — theme choice just won't persist across reloads
    }
  }, [mode]);

  return [mode, setMode] as const;
}
