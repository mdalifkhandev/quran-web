"use client";

import { useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkCard } from "@/components/shared/bookmark-card";
import { SectionCard } from "@/components/shared/section-card";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [selectedFolder, setSelectedFolder] = useState<string>("All");

  const groups = bookmarks.reduce(
    (acc: Record<string, typeof bookmarks>, b) => {
      (acc[b.folder] ||= []).push(b);
      return acc;
    },
    {},
  );

  const folders = useMemo(() => ["All", ...Object.keys(groups)], [groups]);
  const visibleItems = useMemo(() => (selectedFolder === "All" ? bookmarks : groups[selectedFolder] ?? []), [bookmarks, groups, selectedFolder]);

  return (
    <div className="grid gap-4 pb-6 xl:grid-cols-[260px_1fr]">
      <aside className="surface h-fit p-3">
        <div className="mb-3 flex items-center gap-2">
          <Bookmark size={16} />
          <h1 className="text-base font-semibold">Bookmark Folders</h1>
        </div>
        <div className="space-y-2">
          {folders.map((folder) => (
            <button key={folder} className={selectedFolder === folder ? "btn btn-brand w-full text-left" : "btn w-full text-left"} onClick={() => setSelectedFolder(folder)}>
              {folder} ({folder === "All" ? bookmarks.length : (groups[folder] ?? []).length})
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-3">
        <SectionCard title={`${selectedFolder} Bookmarks`} subtitle={`${visibleItems.length} ayah saved`} />
        {visibleItems.length === 0 && <section className="surface p-4 text-sm text-muted-foreground">No bookmarks yet.</section>}
        {visibleItems.map((item) => (
          <BookmarkCard key={item.id} item={item} onDelete={() => item.id && removeBookmark(item.id)} />
        ))}
      </section>
    </div>
  );
}
