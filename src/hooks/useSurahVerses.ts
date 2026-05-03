"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { cacheGet, cacheSet } from "./useOfflineCache";
import type { Verse } from "@/lib/types";

type VersePayload = { verses?: Verse[] };

function normalizeQfAudioUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://audio.qurancdn.com/${url.replace(/^\/+/, "")}`;
}

async function fetchVerses(chapterNumber: number, query: URLSearchParams) {
  const key = `surah:${chapterNumber}:${query.toString()}`;
  const cached = await cacheGet<VersePayload>(key);

  try {
    const recitationId = query.get("audio") ?? "7";
    const page = query.get("page") ?? "1";
    const perPage = query.get("perPage") ?? "50";

    const [verseRes, audioRes] = await Promise.all([
      api.get<VersePayload>(`/quran/verses?${query.toString()}`),
      api.get<{ audioFiles?: Array<{ verseKey: string; url: string }> }>("/quran/audio/verses", {
        params: { chapter: chapterNumber, recitationId, page, perPage },
      }),
    ]);

    const audioMap = new Map((audioRes.data.audioFiles ?? []).map((a) => [a.verseKey, a.url]));
    const merged = (verseRes.data.verses ?? []).map((v) => ({
      ...v,
      audio: {
        ...v.audio,
        url: normalizeQfAudioUrl(v.audio?.url ?? audioMap.get(v.verse_key)),
      },
    }));

    await cacheSet(key, { verses: merged });
    return merged.length > 0 ? merged : cached?.verses ?? [];
  } catch {
    return cached?.verses ?? [];
  }
}

export function useSurahVerses(query: URLSearchParams, chapterNumber: number) {
  const queryResult = useQuery({
    queryKey: ["surah-verses", chapterNumber, query.toString()],
    queryFn: () => fetchVerses(chapterNumber, query),
  });

  return {
    verses: queryResult.data ?? [],
    loading: queryResult.isLoading,
    error: queryResult.error ? "Failed to load" : null,
  };
}
