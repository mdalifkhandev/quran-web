"use client";
import { useMemo, useState } from "react";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import type { Verse } from "@/lib/types";
import { VerseActions } from "@/components/reader/verse-actions";

export function VerseCard({ verse, arabic, active, isPlaying, activeWordIndex, domId, arabicFontSize, lineHeight, translationFontSize, showTranslation, onPlay, onBookmark, onCopyArabic, onCopyTranslation }: { verse: Verse; arabic?: string; active?: boolean; isPlaying?: boolean; activeWordIndex?: number | null; domId?: string; arabicFontSize: number; lineHeight: number; translationFontSize: number; showTranslation: boolean; onPlay: () => void; onBookmark: () => void; onCopyArabic: () => void; onCopyTranslation: () => void }) {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const wordParts = useMemo(
    () =>
      (arabic ?? "").split(/(\s+)/).map((part) => ({
        part,
        isSpace: /^\s+$/.test(part),
      })),
    [arabic]
  );

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
          const isSelected = selectedWordIndex === wordIndex;
          const isAudioSelected = typeof activeWordIndex === "number" && activeWordIndex === wordIndex;
          const emphasized = isAudioSelected || isSelected;
          return (
            <button
              key={`${verse.id}-word-${idx}`}
              type="button"
              onClick={() => setSelectedWordIndex(isSelected ? null : wordIndex)}
              className={
                emphasized
                  ? isAudioSelected
                    ? "rounded-md bg-emerald-500/25 px-1 font-bold text-emerald-200"
                    : "rounded-md bg-red-500/25 px-1 font-bold text-red-300"
                  : "rounded-md px-1"
              }
            >
              {part}
            </button>
          );
        })}
      </p>
      {showTranslation && verse.translations?.map((t) => (
        <div key={`${verse.id}-${t.resource_id}`} translate="no" className="pt-2.5 text-sm text-[var(--fg)]/90" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(t.text) }} />
      ))}
      <VerseActions onPlay={onPlay} onBookmark={onBookmark} onCopyArabic={onCopyArabic} onCopyTranslation={onCopyTranslation} />
    </article>
  );
}
