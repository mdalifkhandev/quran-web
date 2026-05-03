"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Search } from "lucide-react";
import { api } from "@/lib/api-client";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { useSettingsStore } from "@/store/useSettingsStore";
import { db, type CacheEntry } from "@/lib/db/dexie";
import type { Verse } from "@/lib/types";

type SearchVerse = {
  verse_key?: string;
  verse_id?: number;
  text_uthmani?: string;
  highlighted?: string;
  translations?: Array<{ text?: string; resource_id?: number }>;
};

type SearchResponse = {
  pagination?: { current_page?: number; total_pages?: number; total_records?: number };
  result?: {
    navigation?: Array<{ name?: string; value?: string; result_type?: string }>;
    verses?: SearchVerse[];
  };
};

type LocalHit = {
  id: string;
  href: string;
  verseKey: string;
  chapterNumber: number;
  arabic?: string;
  translation?: string;
};

function parseChapterFromCacheKey(key: string) {
  const parts = key.split(":");
  const chapterNumber = Number(parts[1]);
  return Number.isFinite(chapterNumber) ? chapterNumber : null;
}

function pickVerseText(v: Verse) {
  return v.text_uthmani_tajweed ?? v.text_indopak ?? v.text_uthmani ?? "";
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mode, setMode] = useState<"quick" | "advanced">("quick");
  const [exact, setExact] = useState(false);
  const [page, setPage] = useState(1);
  const [cacheItems, setCacheItems] = useState<CacheEntry[]>([]);
  const { settings } = useSettingsStore();

  const translationIds = useMemo(() => settings.translationIds.join(","), [settings.translationIds]);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["live-search", mode, debouncedQuery, page, exact, translationIds],
    enabled: debouncedQuery.length > 1,
    retry: false,
    queryFn: async () => {
      const { data } = await api.get<SearchResponse>("/search", {
        params: {
          mode,
          query: debouncedQuery,
          language: settings.language,
          page,
          size: mode === "advanced" ? 30 : 20,
          exact_matches_only: exact ? 1 : 0,
          translation_ids: translationIds || undefined,
          get_text: 1,
          highlight: 1,
        },
      });
      return data;
    },
  });

  const verses = data?.result?.verses ?? [];
  const navigation = data?.result?.navigation ?? [];
  const totalPages = data?.pagination?.total_pages ?? 1;
  const status = (error as AxiosError<{ message?: string; payload?: { message?: string } }> | null)?.response?.status;
  const apiErrorPayload = (error as AxiosError<{ message?: string; payload?: { message?: string } }> | null)?.response?.data;
  const isSearchScopeForbidden = status === 403;
  const userError =
    isSearchScopeForbidden
      ? "Search API access is not enabled for your client yet (403). Quran Foundation support-এ search scope enable করতে হবে।"
      : apiErrorPayload?.payload?.message ?? apiErrorPayload?.message ?? null;
  useEffect(() => {
    if (!isSearchScopeForbidden) return;
    db.cache.toArray().then(setCacheItems);
  }, [isSearchScopeForbidden]);

  const localHits = useMemo(() => {
    if (!isSearchScopeForbidden || debouncedQuery.length <= 1) return [] as LocalHit[];
    const needle = debouncedQuery.toLowerCase();
    const hits: LocalHit[] = [];
    for (const entry of cacheItems) {
      if (!entry.key.startsWith("surah:")) continue;
      const chapterNumber = parseChapterFromCacheKey(entry.key);
      if (!chapterNumber) continue;
      const value = entry.value as { verses?: Verse[] } | null;
      const versesInEntry = value?.verses ?? [];
      for (const verse of versesInEntry) {
        const arabic = pickVerseText(verse);
        const translation = verse.translations?.map((t) => t.text).join(" ") ?? "";
        const hay = `${verse.verse_key} ${arabic} ${translation}`.toLowerCase();
        if (!hay.includes(needle)) continue;
        hits.push({
          id: `${entry.key}-${verse.id}`,
          href: `/surah/${chapterNumber}#${verse.verse_key}`,
          verseKey: verse.verse_key,
          chapterNumber,
          arabic,
          translation: verse.translations?.[0]?.text,
        });
        if (hits.length >= 100) return hits;
      }
    }
    return hits;
  }, [cacheItems, debouncedQuery, isSearchScopeForbidden]);

  return (
    <div className="space-y-4 pb-5">
      <h1 className="text-2xl font-semibold">Search</h1>

      <div className="surface flex items-center gap-2 p-3">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="w-full bg-transparent outline-none"
          placeholder="Search Quran (Arabic/Bangla/English)"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button className={mode === "quick" ? "btn btn-brand" : "btn"} onClick={() => { setMode("quick"); setPage(1); }}>Quick</button>
        <button className={mode === "advanced" ? "btn btn-brand" : "btn"} onClick={() => { setMode("advanced"); setPage(1); }}>Advanced</button>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={exact} onChange={(e) => { setExact(e.target.checked); setPage(1); }} disabled={mode !== "advanced"} />
          Exact match
        </label>
      </div>

      {error && <section className="surface p-4 text-sm text-red-500">{userError ?? "Search failed. Please try again."}</section>}
      {isSearchScopeForbidden && (
        <section className="surface p-3 text-xs text-muted-foreground">
          Live search unavailable, showing local cached results.
        </section>
      )}
      {isFetching && <section className="surface p-4 text-sm text-muted-foreground">Searching...</section>}
      {debouncedQuery.length <= 1 && <section className="surface p-4 text-sm text-muted-foreground">Type at least 2 letters.</section>}

      {navigation.length > 0 && (
        <section className="surface p-4">
          <h2 className="mb-2 font-medium">Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {navigation.map((n, i) => (
              <span key={`${n.name}-${i}`} className="badge">
                {n.name ?? n.value ?? n.result_type ?? "Result"}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-2">
        {!isSearchScopeForbidden && verses.map((v, i) => {
          const verseKey = v.verse_key ?? "";
          const chapter = Number(verseKey.split(":")[0]) || 1;
          return (
            <Link key={`${verseKey}-${i}`} href={`/surah/${chapter}#${verseKey}`} className="surface block p-3 transition hover:-translate-y-0.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="badge">{verseKey || `Verse ${v.verse_id ?? i + 1}`}</span>
                <span className="text-xs text-muted-foreground">Surah {chapter}</span>
              </div>
              {v.text_uthmani && (
                <p dir="rtl" translate="no" className="text-right text-lg">
                  {v.text_uthmani}
                </p>
              )}
              {v.highlighted && (
                <p className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(v.highlighted) }} />
              )}
              {!v.highlighted && v.translations?.[0]?.text && (
                <p
                  className="mt-2 text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(v.translations[0].text ?? "") }}
                />
              )}
            </Link>
          );
        })}
        {isSearchScopeForbidden &&
          localHits.map((r) => (
            <Link key={r.id} href={r.href} className="surface block p-3 transition hover:-translate-y-0.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="badge">{r.verseKey}</span>
                <span className="text-xs text-muted-foreground">Surah {r.chapterNumber}</span>
              </div>
              <p dir="rtl" translate="no" className="text-right text-lg">
                {r.arabic}
              </p>
              {r.translation && (
                <p className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(r.translation) }} />
              )}
            </Link>
          ))}
      </div>

      {mode === "advanced" && debouncedQuery.length > 1 && !isSearchScopeForbidden && (
        <div className="flex items-center justify-between">
          <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
          <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}
