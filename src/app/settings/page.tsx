"use client";

import { useEffect, useMemo, useState } from "react";
import type { Language, Tafsir, Translation } from "@/lib/types";
import { useQuranResources } from "@/hooks/useQuranResources";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function SettingsPage() {
  const [onlySelectedLanguage, setOnlySelectedLanguage] = useState(true);
  const { settings, updateSettings } = useSettingsStore();
  const { data } = useQuranResources(settings.language);
  const languages: Language[] = useMemo(
    () => (data.languages?.languages as Language[]) ?? [],
    [data.languages],
  );
  const translations: Translation[] = useMemo(
    () => (data.translations?.translations as Translation[]) ?? [],
    [data.translations],
  );
  const tafsirs: Tafsir[] = useMemo(
    () => (data.tafsirs?.tafsirs as Tafsir[]) ?? [],
    [data.tafsirs],
  );
  const orderedTranslations = useMemo(() => {
    const current = settings.language.toLowerCase();
    const score = (t: Translation) => {
      const hay = `${t.language_name} ${t.name}`.toLowerCase();
      if (current === "bn" && (hay.includes("bangla") || hay.includes("bengali"))) return 0;
      if (current === "en" && hay.includes("english")) return 0;
      if (hay.includes(current)) return 1;
      return 2;
    };
    return [...translations].sort((a, b) => score(a) - score(b));
  }, [translations, settings.language]);
  const visibleTranslations = useMemo(() => {
    if (!onlySelectedLanguage) return orderedTranslations;
    const current = settings.language.toLowerCase();
    return orderedTranslations.filter((t) => {
      const hay = `${t.language_name} ${t.name}`.toLowerCase();
      if (current === "bn") return hay.includes("bangla") || hay.includes("bengali");
      if (current === "en") return hay.includes("english");
      return hay.includes(current);
    });
  }, [onlySelectedLanguage, orderedTranslations, settings.language]);

  const visibleTafsirs = useMemo(() => {
    const current = settings.language.toLowerCase();
    return tafsirs.filter((t) => {
      const hay = `${t.language_name} ${t.name}`.toLowerCase();
      if (current === "bn") return hay.includes("bangla") || hay.includes("bengali");
      if (current === "en") return hay.includes("english");
      return hay.includes(current);
    });
  }, [tafsirs, settings.language]);

  useEffect(() => {
    if (translations.length === 0) return;
    const current = settings.language.toLowerCase();
    const selectedSet = new Set(settings.translationIds);
    const selectedItems = translations.filter((t) => selectedSet.has(t.id));
    const hasCurrentLangSelected = selectedItems.some((t) => {
      const hay = `${t.language_name} ${t.name}`.toLowerCase();
      if (current === "bn") return hay.includes("bangla") || hay.includes("bengali");
      if (current === "en") return hay.includes("english");
      return hay.includes(current);
    });
    if (settings.translationIds.length > 0 && hasCurrentLangSelected) return;

    const defaults = orderedTranslations
      .filter((t) => {
        const hay = `${t.language_name} ${t.name}`.toLowerCase();
        if (current === "bn") return hay.includes("bangla") || hay.includes("bengali");
        if (current === "en") return hay.includes("english");
        return hay.includes(current);
      })
      .slice(0, 2)
      .map((t) => t.id);

    if (defaults.length > 0) {
      updateSettings({ translationIds: defaults, showTranslation: true });
    }
  }, [translations, orderedTranslations, settings.language, settings.translationIds, updateSettings]);

  return (
    <div className="space-y-4 pb-5">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="surface grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">
          Language
          <select
            value={settings.language}
            onChange={(e) =>
              updateSettings({
                language: e.target.value,
                translationIds: [],
                tafsirIds: [],
              })
            }
            className="mt-1 w-full rounded-lg border bg-(--bg-soft) p-2"
          >
            {languages.length === 0 && <option value={settings.language}>{settings.language}</option>}
            {languages.map((lang) => (
              <option key={lang.id} value={lang.iso_code}>
                {lang.name} ({lang.iso_code})
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Theme
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as "light" | "dark" | "sepia" })}
            className="mt-1 w-full rounded-lg border bg-(--bg-soft) p-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia/Green</option>
          </select>
        </label>

        <label className="text-sm">
          Arabic Font Size: {settings.arabicFontSize}
          <input type="range" min={24} max={56} value={settings.arabicFontSize} onChange={(e) => updateSettings({ arabicFontSize: Number(e.target.value) })} className="mt-1 w-full" />
        </label>

        <label className="text-sm">
          Translation Font Size: {settings.translationFontSize}
          <input type="range" min={12} max={28} value={settings.translationFontSize} onChange={(e) => updateSettings({ translationFontSize: Number(e.target.value) })} className="mt-1 w-full" />
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.showWords} onChange={(e) => updateSettings({ showWords: e.target.checked })} />
          Show word-by-word
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.showTranslation} onChange={(e) => updateSettings({ showTranslation: e.target.checked })} />
          Show translation
        </label>
      </section>

      <section className="surface p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-medium">Translations ({settings.translationIds.length} selected)</p>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlySelectedLanguage} onChange={(e) => setOnlySelectedLanguage(e.target.checked)} />
            Only selected language
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleTranslations.map((t) => {
            const checked = settings.translationIds.includes(t.id);
            return (
              <label key={t.id} className={checked ? "btn btn-brand" : "btn"}>
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={checked}
                  onChange={(e) =>
                    updateSettings({
                      translationIds: e.target.checked
                        ? [...settings.translationIds, t.id]
                        : settings.translationIds.filter((id) => id !== t.id),
                    })
                  }
                />
                {t.name} <span className="text-xs opacity-70">({t.language_name})</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="surface p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-medium">Tafsirs ({settings.tafsirIds.length} selected)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(visibleTafsirs.length > 0 ? visibleTafsirs : tafsirs).map((t) => {
            const checked = settings.tafsirIds.includes(t.id);
            return (
              <label key={t.id} className={checked ? "btn btn-brand" : "btn"}>
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={checked}
                  onChange={(e) =>
                    updateSettings({
                      tafsirIds: e.target.checked
                        ? [...settings.tafsirIds, t.id]
                        : settings.tafsirIds.filter((id) => id !== t.id),
                    })
                  }
                />
                {t.name} <span className="text-xs opacity-70">({t.language_name})</span>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
