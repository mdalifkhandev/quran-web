"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export function ThemeSync() {
  const theme = useSettingsStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "sepia");

    if (theme === "dark") {
      root.classList.add("dark");
      return;
    }

    if (theme === "sepia") {
      root.classList.add("sepia");
    }
  }, [theme]);

  return null;
}
