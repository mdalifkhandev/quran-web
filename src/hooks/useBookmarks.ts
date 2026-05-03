"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db/dexie";
import type { Bookmark } from "@/lib/types";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    db.bookmarks.toArray().then(setBookmarks);
  }, []);

  const addBookmark = async (bookmark: Bookmark) => {
    await db.bookmarks.add(bookmark);
    setBookmarks(await db.bookmarks.toArray());
  };

  const removeBookmark = async (id: number) => {
    await db.bookmarks.delete(id);
    setBookmarks(await db.bookmarks.toArray());
  };

  return { bookmarks, addBookmark, removeBookmark };
}
