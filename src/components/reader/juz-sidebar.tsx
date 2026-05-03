"use client";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import type { Chapter, Juz } from "@/lib/types";

function getChapterIdsFromMapping(mapping: Record<string, string> | undefined) {
  if (!mapping) return [];
  const ids = Object.keys(mapping)
    .map((k) => Number(k.split(":")[0]))
    .filter((n) => Number.isFinite(n) && n > 0);
  return Array.from(new Set(ids));
}

export function JuzSidebar({
  juzs,
  chapters,
  activeChapter,
  onSelectChapter,
}: {
  juzs: Juz[];
  chapters: Chapter[];
  activeChapter: number;
  onSelectChapter?: (chapterId: number) => void;
}) {
  const dedupedJuzs = useMemo(
    () =>
      Array.from(new Map(juzs.map((j) => [j.juz_number, j])).values()).sort(
        (a, b) => a.juz_number - b.juz_number
      ),
    [juzs]
  );

  const activeJuzNumber = useMemo(() => {
    const match = dedupedJuzs.find((j) => getChapterIdsFromMapping(j.verse_mapping).includes(activeChapter));
    return match?.juz_number ?? 1;
  }, [dedupedJuzs, activeChapter]);

  const [manualOpenJuzNumber, setManualOpenJuzNumber] = useState<number | null>(null);
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const openJuzNumber = manualOpenJuzNumber ?? activeJuzNumber;

  return (
    <div className="surface hidden h-[calc(100%-3.25rem)] p-3 xl:flex xl:flex-col">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-(--line) bg-(--bg-soft) px-3 py-2">
        <Search size={16} className="text-muted-foreground" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search Juz" />
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {dedupedJuzs.slice(0, 30).map((j) => {
          const chapterIds = getChapterIdsFromMapping(j.verse_mapping);
          const linkedChapters = chapterIds.map((id) => chapterById.get(id)).filter(Boolean) as Chapter[];
          const isExpanded = openJuzNumber === j.juz_number;
          return (
          <div key={j.id} className="rounded-2xl border border-(--line) p-3">
            <button
              type="button"
              onClick={() => setManualOpenJuzNumber((prev) => (prev === j.juz_number ? null : j.juz_number))}
              className="mb-1 flex w-full items-start justify-between"
            >
              <p className="text-[1.05rem] font-semibold text-(--brand)">Juz {j.juz_number}</p>
              <div className="flex items-center gap-2">
                <p className="text-right text-sm text-muted-foreground">
                  {Math.max(1, chapterIds.length)}
                  <br />
                  Surah
                </p>
                {isExpanded ? <ChevronUp size={14} className="mt-0.5 text-muted-foreground" /> : <ChevronDown size={14} className="mt-0.5 text-muted-foreground" />}
              </div>
            </button>
            <p className="text-sm text-muted-foreground">
              {linkedChapters[0]?.name_simple ?? `Juz ${j.juz_number}`} &amp; More
            </p>
            {isExpanded && (
              <div className="mt-3 space-y-2">
                {linkedChapters.map((chapter) => (
                  <button
                    key={`${j.id}-${chapter.id}`}
                    type="button"
                    onClick={() => {
                      setManualOpenJuzNumber(j.juz_number);
                      onSelectChapter?.(chapter.id);
                    }}
                    className={
                      chapter.id === activeChapter
                        ? "w-full rounded-xl border border-(--brand) bg-[color-mix(in_oklab,var(--brand-soft)_45%,transparent)] px-3 py-2 text-left"
                        : "w-full rounded-xl border border-(--line) px-3 py-2 text-left"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          chapter.id === activeChapter
                            ? "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--brand) text-sm font-bold text-black"
                            : "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--bg-soft) text-sm font-bold text-muted-foreground"
                        }
                      >
                        {String(chapter.id).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-[1.02rem] font-semibold">{chapter.name_simple}</p>
                        <p className="text-sm text-muted-foreground">{chapter.translated_name?.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
