"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db/dexie";

export function useLastRead() {
  const [lastRead, setLastRead] = useState<{ chapterNumber: number; verseKey: string; ayahNumber: number } | null>(null);
  useEffect(() => {
    db.lastRead.get("main").then((v) => v && setLastRead(v));
  }, []);

  const saveLastRead = async (chapterNumber: number, verseKey: string, ayahNumber: number) => {
    const payload = { id: "main", chapterNumber, verseKey, ayahNumber, updatedAt: new Date().toISOString() };
    await db.lastRead.put(payload);
    setLastRead(payload);
  };

  return { lastRead, saveLastRead };
}
