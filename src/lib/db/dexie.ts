import Dexie, { type Table } from "dexie";
import type { Bookmark, Settings } from "@/lib/types";

export type CacheEntry = { key: string; value: unknown; updatedAt: number };
export type LastRead = { id: string; chapterNumber: number; verseKey: string; ayahNumber: number; updatedAt: string };

class QuranCompanionDb extends Dexie {
  bookmarks!: Table<Bookmark, number>;
  settings!: Table<Settings & { id: string }, string>;
  cache!: Table<CacheEntry, string>;
  lastRead!: Table<LastRead, string>;

  constructor() {
    super("quran-companion-db");
    this.version(1).stores({
      bookmarks: "++id, folder, verseKey, chapterNumber, createdAt",
      settings: "id",
      cache: "key, updatedAt",
      lastRead: "id, chapterNumber, updatedAt",
    });
  }
}

export const db = new QuranCompanionDb();
