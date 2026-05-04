"use client";
import { useMemo } from "react";
import type { Settings } from "@/lib/types";
import type { Tafsir, Translation } from "@/lib/types";
import { useQuranResources } from "@/hooks/useQuranResources";
import { useSettingsStore } from "@/store/useSettingsStore";

export function SettingsPanel({ settings }: { settings: Settings }) {
  const { updateSettings } = useSettingsStore();
  const { data } = useQuranResources(settings.language);
  const translations = useMemo(
    () => (data.translations?.translations as Translation[]) ?? [],
    [data.translations]
  );
  const tafsirs = useMemo(
    () => (data.tafsirs?.tafsirs as Tafsir[]) ?? [],
    [data.tafsirs]
  );
  const currentLang = settings.language.toLowerCase();
  const visibleTranslations = useMemo(() => {
    return translations.filter((t) => {
      const hay = `${t.language_name} ${t.name}`.toLowerCase();
      if (currentLang === "bn") return hay.includes("bangla") || hay.includes("bengali");
      if (currentLang === "en") return hay.includes("english");
      return hay.includes(currentLang);
    });
  }, [translations, currentLang]);
  const visibleTafsirs = useMemo(() => {
    return tafsirs.filter((t) => {
      const hay = `${t.language_name} ${t.name}`.toLowerCase();
      if (currentLang === "bn") return hay.includes("bangla") || hay.includes("bengali");
      if (currentLang === "en") return hay.includes("english");
      return hay.includes(currentLang);
    });
  }, [tafsirs, currentLang]);

  return (
    <aside className="surface hidden space-y-4 p-4 xl:sticky xl:top-18 xl:block xl:max-h-[calc(100vh-9.5rem)] xl:self-start xl:overflow-y-auto">
      <div className="flex rounded-full border bg-(--bg-soft) p-1 text-sm">
        <button className="btn btn-brand inline-flex h-8 flex-1 items-center justify-center">Translation</button>
        <button className="btn inline-flex h-8 flex-1 items-center justify-center">Reading</button>
      </div>

      <h2 className="text-sm font-semibold">Reading Settings</h2>
      <div className="space-y-4">
        <label className="block">
          <div className="mb-1 flex items-center justify-between text-sm"><span>Arabic Font Size</span><span>{settings.arabicFontSize}</span></div>
          <input
            type="range"
            min={24}
            max={56}
            value={settings.arabicFontSize}
            onChange={(e) => updateSettings({ arabicFontSize: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="block">
          <div className="mb-1 flex items-center justify-between text-sm"><span>Translation Font Size</span><span>{settings.translationFontSize}</span></div>
          <input
            type="range"
            min={12}
            max={28}
            value={settings.translationFontSize}
            onChange={(e) => updateSettings({ translationFontSize: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="block">
          <div className="mb-1 flex items-center justify-between text-sm"><span>Line Height</span><span>{settings.lineHeight.toFixed(1)}</span></div>
          <input
            type="range"
            min={1.4}
            max={2.4}
            step={0.1}
            value={settings.lineHeight}
            onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
            className="w-full"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-(--line) bg-(--bg-soft) p-3 text-sm">
        <label className="block">
          <span className="mb-1 block text-muted-foreground">Script</span>
          <select
            value={settings.script}
            onChange={(e) => updateSettings({ script: e.target.value as Settings["script"] })}
            className="w-full rounded-lg border bg-background px-2 py-1.5"
          >
            <option value="uthmani">Uthmani</option>
            <option value="indopak">Indopak</option>
            <option value="tajweed">Uthmani Tajweed</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-muted-foreground">Theme</span>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as Settings["theme"] })}
            className="w-full rounded-lg border bg-background px-2 py-1.5"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
          </select>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={settings.showTranslation} onChange={(e) => updateSettings({ showTranslation: e.target.checked })} />
          Show translation
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={settings.showWords} onChange={(e) => updateSettings({ showWords: e.target.checked })} />
          Show word-by-word
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-(--line) bg-(--bg-soft) p-3 text-sm">
        <h3 className="font-medium">Translations</h3>
        <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
          {(visibleTranslations.length > 0 ? visibleTranslations : translations).map((t) => {
            const checked = settings.translationIds.includes(t.id);
            return (
              <label key={t.id} className="flex items-start gap-2 rounded-lg border border-(--line) px-2 py-1.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    updateSettings({
                      translationIds: e.target.checked
                        ? [...settings.translationIds, t.id]
                        : settings.translationIds.filter((id) => id !== t.id),
                    })
                  }
                />
                <span className="text-xs">
                  {t.name} <span className="opacity-70">({t.language_name})</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-(--line) bg-(--bg-soft) p-3 text-sm">
        <h3 className="font-medium">Tafsirs</h3>
        <div className="max-h-36 space-y-1 overflow-y-auto pr-1">
          {(visibleTafsirs.length > 0 ? visibleTafsirs : tafsirs).map((t) => {
            const checked = settings.tafsirIds.includes(t.id);
            return (
              <label key={t.id} className="flex items-start gap-2 rounded-lg border border-(--line) px-2 py-1.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    updateSettings({
                      tafsirIds: e.target.checked
                        ? [...settings.tafsirIds, t.id]
                        : settings.tafsirIds.filter((id) => id !== t.id),
                    })
                  }
                />
                <span className="text-xs">
                  {t.name} <span className="opacity-70">({t.language_name})</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
