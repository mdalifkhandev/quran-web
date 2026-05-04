"use client";
import { useMemo, useState } from "react";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import type { Verse } from "@/lib/types";
import { VerseActions } from "@/components/reader/verse-actions";

export function VerseCard({ verse, arabic, active, isPlaying, activeWordIndex, domId, arabicFontSize, lineHeight, translationFontSize, showTranslation, onPlay, onBookmark, onCopyArabic, onCopyTranslation, onShare }: { verse: Verse; arabic?: string; active?: boolean; isPlaying?: boolean; activeWordIndex?: number | null; domId?: string; arabicFontSize: number; lineHeight: number; translationFontSize: number; showTranslation: boolean; onPlay: () => void; onBookmark: () => void; onCopyArabic: () => void; onCopyTranslation: () => void; onShare: () => void }) {
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const [showTafsir, setShowTafsir] = useState(false);
  const wordParts = useMemo(
    () =>
      (arabic ?? "").split(/(\s+)/).map((part) => ({
        part,
        isSpace: /^\s+$/.test(part),
      })),
    [arabic]
  );
  const wordsByPosition = useMemo(() => {
    const map = new Map<number, Verse["words"][number]>();
    verse.words?.forEach((w) => {
      if (typeof w.position === "number") map.set(w.position, w);
    });
    return map;
  }, [verse.words]);
  const focusedWordIndex = hoveredWordIndex;
  const focusedWord = typeof focusedWordIndex === "number" ? wordsByPosition.get(focusedWordIndex + 1) : undefined;
  const focusedTooltip =
    focusedWord?.translation?.text || focusedWord?.transliteration?.text || "Word meaning unavailable";

  return (
    <article
      id={domId}
      aria-current={active ? "true" : undefined}
      data-active={active ? "true" : "false"}
      className={`surface p-4 transition-all duration-300 ${active ? "ring-2" : ""}`}
      style={
        active
          ? {
              borderColor: "var(--brand)",
              background: "color-mix(in oklab, var(--brand-soft) 34%, var(--card))",
              boxShadow: isPlaying
                ? "0 0 0 2px color-mix(in oklab, var(--brand) 80%, transparent), 0 12px 26px rgba(0,0,0,0.24)"
                : "0 0 0 1px color-mix(in oklab, var(--brand) 55%, transparent), 0 8px 18px rgba(0,0,0,0.18)",
            }
          : undefined
      }
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className={`badge ${active && isPlaying ? "animate-pulse" : ""}`}>{active && isPlaying ? `Playing • ${verse.verse_key}` : verse.verse_key}</span>
        <span className="text-xs text-muted-foreground">Ayah {verse.verse_number}</span>
      </div>
      <p dir="rtl" translate="no" className="arabic-text text-right" style={{ fontSize: `${arabicFontSize}px`, lineHeight }}>
        {wordParts.map(({ part, isSpace }, idx) => {
          if (isSpace) return <span key={`${verse.id}-space-${idx}`}>{part}</span>;
          const wordIndex = wordParts.slice(0, idx + 1).filter((item) => !item.isSpace).length - 1;
          const isAudioSelected = typeof activeWordIndex === "number" && activeWordIndex === wordIndex;
          const emphasized = isAudioSelected;
          const wordData = wordsByPosition.get(wordIndex + 1);
          const wordTooltip =
            wordData?.translation?.text ||
            wordData?.transliteration?.text ||
            "Word meaning unavailable";
          return (
            <span
              key={`${verse.id}-word-${idx}`}
              title={wordTooltip}
              aria-label={wordTooltip}
              onMouseEnter={() => setHoveredWordIndex(wordIndex)}
              onMouseLeave={() => setHoveredWordIndex((prev) => (prev === wordIndex ? null : prev))}
              className={
                emphasized
                  ? "rounded-md bg-emerald-500/25 px-1 font-bold text-emerald-200"
                  : "rounded-md px-1"
              }
            >
              {part}
            </span>
          );
        })}
      </p>
      {typeof focusedWordIndex === "number" && (
        <div className="mt-2 inline-flex max-w-full rounded-lg border border-(--line) bg-(--bg-soft) px-2.5 py-1.5 text-xs text-muted-foreground">
          <span className="truncate">{focusedTooltip}</span>
        </div>
      )}
      {showTranslation && verse.translations?.map((t) => (
        <div key={`${verse.id}-${t.resource_id}`} translate="no" className="pt-2.5 text-sm text-[var(--fg)]/90" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }} />
      ))}
      <VerseActions onPlay={onPlay} onBookmark={onBookmark} onCopyArabic={onCopyArabic} onCopyTranslation={onCopyTranslation} onShare={onShare} onTafsir={() => setShowTafsir(true)} />

      {showTafsir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="surface max-h-[80vh] w-full max-w-2xl overflow-y-auto p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Tafsir - {verse.verse_key}</h3>
              <button className="btn h-8" onClick={() => setShowTafsir(false)} type="button">Close</button>
            </div>
            {verse.tafsirs && verse.tafsirs.length > 0 ? (
              <div className="space-y-3">
                {verse.tafsirs.map((t) => (
                  <div key={`${verse.id}-tafsir-${t.resource_id}`} className="rounded-xl border border-(--line) bg-(--bg-soft) p-3">
                    <p className="mb-2 text-xs text-muted-foreground">Source {t.resource_id}</p>
                    <div className="text-sm leading-7" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tafsir available for this ayah with current settings.</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
