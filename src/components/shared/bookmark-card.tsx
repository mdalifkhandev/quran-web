import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { Bookmark } from "@/lib/types";

export function BookmarkCard({ item, onDelete }: { item: Bookmark; onDelete: () => void }) {
  return (
    <article className="surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="badge">{item.verseKey}</span>
            <span className="text-xs text-muted-foreground">{item.folder}</span>
          </div>
          <p dir="rtl" translate="no" className="arabic-text text-right text-2xl leading-loose">{item.arabic}</p>
          {item.translation && <p className="mt-2 text-sm text-muted-foreground">{item.translation}</p>}
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Link href={`/surah/${item.chapterNumber}#${item.verseKey}`} className="btn text-center">Open Ayah</Link>
          <button className="btn" onClick={onDelete}><Trash2 size={14} /></button>
        </div>
      </div>
    </article>
  );
}
