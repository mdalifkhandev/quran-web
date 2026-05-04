"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/lib/types";

function parseCsvIds(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

const defaults: Settings = {
  language: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? "bn",
  translationIds: parseCsvIds(process.env.NEXT_PUBLIC_DEFAULT_TRANSLATION_IDS),
  tafsirIds: parseCsvIds(process.env.NEXT_PUBLIC_DEFAULT_TAFSIR_IDS),
  recitationId: Number(process.env.NEXT_PUBLIC_DEFAULT_RECITATION_ID) || 7,
  script: "uthmani",
  arabicFontSize: 38,
  translationFontSize: 18,
  lineHeight: 1.9,
  theme: "dark",
  repeatAyahCount: 1,
  delayBetweenAyahsMs: 400,
  autoNext: true,
  showTranslation: true,
  showWords: false,
  showTafsirButton: true,
  compactMode: false,
};

export const useSettingsStore = create<{
  settings: Settings;
  updateSettings: (next: Partial<Settings>) => void;
}>()(
  persist(
    (set) => ({
      settings: defaults,
      updateSettings: (next) => set((s) => ({ settings: { ...s.settings, ...next } })),
    }),
    { name: "quran-companion-settings" },
  ),
);
