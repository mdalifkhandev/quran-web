"use client";
import { BookMarked, Copy, Play, Share2, BookText } from "lucide-react";

export function VerseActions({ onPlay, onBookmark, onCopyArabic, onCopyTranslation }: { onPlay: () => void; onBookmark: () => void; onCopyArabic: () => void; onCopyTranslation: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
      <button className="btn inline-flex h-8 items-center gap-1" onClick={onPlay}><Play size={12} /> Play</button>
      <button className="btn inline-flex h-8 items-center gap-1" onClick={onBookmark}><BookMarked size={12} /> Bookmark</button>
      <button className="btn inline-flex h-8 items-center gap-1" onClick={onCopyArabic}><Copy size={12} /> Arabic</button>
      <button className="btn inline-flex h-8 items-center gap-1" onClick={onCopyTranslation}><Copy size={12} /> Translation</button>
      <button className="btn inline-flex h-8 items-center gap-1" type="button"><Share2 size={12} /> Share</button>
      <button className="btn inline-flex h-8 items-center gap-1" type="button"><BookText size={12} /> Tafsir</button>
    </div>
  );
}
