"use client";
import type { Settings } from "@/lib/types";

export function SettingsPanel({ settings }: { settings: Settings }) {
  return (
    <aside className="surface hidden space-y-4 p-4 xl:sticky xl:top-18 xl:block xl:max-h-[calc(100vh-9.5rem)] xl:self-start xl:overflow-y-auto">
      <div className="flex rounded-full border bg-(--bg-soft) p-1 text-sm">
        <button className="btn btn-brand inline-flex h-8 flex-1 items-center justify-center">Translation</button>
        <button className="btn inline-flex h-8 flex-1 items-center justify-center">Reading</button>
      </div>

      <h2 className="text-sm font-semibold">Reading Settings</h2>
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm"><span>Arabic Font Size</span><span>{settings.arabicFontSize}</span></div>
          <div className="h-1 rounded bg-(--line)"><div className="h-1 rounded bg-(--brand)" style={{ width: `${Math.min(100, (settings.arabicFontSize / 56) * 100)}%` }} /></div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-sm"><span>Translation Font Size</span><span>{settings.translationFontSize}</span></div>
          <div className="h-1 rounded bg-(--line)"><div className="h-1 rounded bg-(--brand)" style={{ width: `${Math.min(100, (settings.translationFontSize / 28) * 100)}%` }} /></div>
        </div>
      </div>

      <div className="rounded-xl border border-(--line) bg-(--bg-soft) p-3 text-sm text-muted-foreground">
        Script: {settings.script}
        <br />
        Theme: {settings.theme}
      </div>
    </aside>
  );
}
