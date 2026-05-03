"use client";
import { db } from "@/lib/db/dexie";

export async function cacheSet(key: string, value: unknown) {
  await db.cache.put({ key, value, updatedAt: Date.now() });
}

export async function cacheGet<T = unknown>(key: string) {
  const found = await db.cache.get(key);
  return (found?.value as T) ?? null;
}
