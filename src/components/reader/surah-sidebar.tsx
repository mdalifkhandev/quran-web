"use client";
import { Search } from "lucide-react";
import type { Chapter } from "@/lib/types";

export function SurahSidebar({
  chapters,
  activeChapter,
  onSelectChapter,
}: {
  chapters: Chapter[];
  activeChapter: number;
  onSelectChapter?: (chapterId: number) => void;
}) {
  return (
    <div className="surface hidden h-[calc(100%-3.25rem)] p-3 xl:flex xl:flex-col">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-(--line) bg-(--bg-soft) px-3 py-2">
        <Search size={16} className="text-muted-foreground" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search Surah" />
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {chapters.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectChapter?.(c.id)}
            className={c.id === activeChapter ? "block w-full rounded-2xl border border-(--brand) bg-[color-mix(in_oklab,var(--brand-soft)_45%,transparent)] px-4 py-3 text-left" : "block w-full rounded-2xl border border-(--line) px-4 py-3 text-left"}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={c.id === activeChapter ? "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--brand) text-sm font-bold text-black" : "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--bg-soft) text-sm font-bold text-muted-foreground"}>
                {c.id}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[1.02rem] font-semibold leading-none">{c.name_simple}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.translated_name?.name}</p>
                </div>
              </div>
              <p className="arabic-text text-xl text-muted-foreground" dir="rtl">{c.name_arabic}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
