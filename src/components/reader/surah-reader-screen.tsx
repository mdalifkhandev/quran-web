"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAudioPlayer } from "@/store/useAudioPlayer";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useLastRead } from "@/hooks/useLastRead";
import type { Chapter, Juz, Verse } from "@/lib/types";
import { ReaderLayout } from "@/components/reader/reader-layout";
import { SidebarNav } from "@/components/reader/sidebar-nav";
import { SurahSidebar } from "@/components/reader/surah-sidebar";
import { JuzSidebar } from "@/components/reader/juz-sidebar";
import { PageSidebar } from "@/components/reader/page-sidebar";
import { SettingsPanel } from "@/components/reader/settings-panel";
import { VerseCard } from "@/components/reader/verse-card";
import { mockDataSource, qfDataSource } from "@/lib/data-source";

let chaptersCache: Chapter[] | null = null;
let juzsCache: Juz[] | null = null;

function normalizeAudioUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://audio.qurancdn.com/${url.replace(/^\/+/, "")}`;
}

export function SurahReaderScreen({ chapterNumber }: { chapterNumber: number }) {
  const [sideMode, setSideMode] = useState<"surah" | "juz" | "page">("surah");
  const [currentChapter, setCurrentChapter] = useState(chapterNumber);
  const [chapters, setChapters] = useState<Chapter[]>(chaptersCache ?? []);
  const [juzs, setJuzs] = useState<Juz[]>(juzsCache ?? []);
  const [renderedVerses, setRenderedVerses] = useState<Verse[]>([]);
  const [bootLoading, setBootLoading] = useState(renderedVerses.length === 0);
  const [verseLoading, setVerseLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { settings } = useSettingsStore();
  const { setQueue, setPlaying, currentIndex, queue, playing, currentTimeMs, durationMs } = useAudioPlayer();
  const { addBookmark } = useBookmarks();
  const { saveLastRead } = useLastRead();
  const fallbackReciter = settings.alFurqanReciterId ?? "abdul-basit-murattal";

  useEffect(() => {
    const run = async () => {
      try {
        setVerseLoading(true);
        const [c, j, v] = await Promise.all([
          chaptersCache ? Promise.resolve(chaptersCache) : qfDataSource.getChapters(),
          juzsCache ? Promise.resolve(juzsCache) : qfDataSource.getJuzs(),
          qfDataSource.getVersesByChapter(currentChapter, {
            page: 1,
            perPage: 50,
            language: settings.language,
            translations: settings.translationIds,
            tafsirs: settings.tafsirIds,
            audio: settings.recitationId ?? 7,
            words: settings.showWords,
            script: settings.script,
          }),
        ]);
        chaptersCache = c;
        juzsCache = j;
        setChapters(c);
        setJuzs(j);
        if (v.length > 0) {
          setRenderedVerses(v);
          setError(null);
        } else {
          setRenderedVerses(await mockDataSource.getVersesByChapter(currentChapter));
          setError(null);
        }
      } catch (e) {
        const mockChapters = chaptersCache ?? (await mockDataSource.getChapters());
        const mockJuzs = juzsCache ?? (await mockDataSource.getJuzs());
        chaptersCache = mockChapters;
        juzsCache = mockJuzs;
        setChapters(mockChapters);
        setJuzs(mockJuzs);
        setRenderedVerses(await mockDataSource.getVersesByChapter(currentChapter));
        setError(e instanceof Error ? e.message : "Live source unavailable");
      } finally {
        setVerseLoading(false);
        setBootLoading(false);
      }
    };
    run();
  }, [currentChapter, settings.language, settings.translationIds, settings.tafsirIds, settings.recitationId, settings.showWords, settings.script]);

  useEffect(() => {
    const activeKey = queue[currentIndex]?.verse_key;
    if (!activeKey) return;
    const target = document.getElementById(`verse-${activeKey.replace(":", "-")}`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex, queue]);

  if (bootLoading && renderedVerses.length === 0) return <div className="surface p-4">Loading Surah...</div>;
  if (error && renderedVerses.length === 0) return <div className="surface p-4 text-red-500">{error}</div>;

  const playbackVerses = renderedVerses.map((v) => {
    const qfUrl = normalizeAudioUrl(v.audio?.url);
    if (qfUrl) {
      return {
        ...v,
        audio: { ...v.audio, url: qfUrl },
      };
    }
    return {
      ...v,
      audio: {
        ...v.audio,
        url: `https://alfurqan.online/api/v1/audio/${fallbackReciter}/surah/${currentChapter}/ayah/${v.verse_number}`,
      },
    };
  });

  const getActiveWordIndex = (verse: Verse, isActiveVerse: boolean) => {
    if (!isActiveVerse || !playing) return null;
    const segments = verse.audio?.segments;
    if (segments && segments.length > 0) {
      for (const seg of segments) {
        if (seg.length === 3) {
          const [word, from, to] = seg;
          if (currentTimeMs >= from && currentTimeMs <= to) return Math.max(0, word - 1);
        }
        if (seg.length === 4) {
          const [, word, from, to] = seg;
          if (currentTimeMs >= from && currentTimeMs <= to) return Math.max(0, word - 1);
        }
      }
    }

    const text = verse.text_uthmani ?? verse.text_indopak ?? "";
    const wordCount = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
    if (wordCount === 0 || durationMs <= 0) return null;
    const progress = Math.min(1, Math.max(0, currentTimeMs / durationMs));
    return Math.min(wordCount - 1, Math.floor(progress * wordCount));
  };

  const handleSelectChapter = (nextChapter: number) => {
    if (nextChapter === currentChapter) return;
    setCurrentChapter(nextChapter);
    if (typeof window !== "undefined") {
      const targetPath = nextChapter === 1 ? "/" : `/surah/${nextChapter}`;
      window.history.replaceState(window.history.state, "", targetPath);
    }
  };

  return (
    <ReaderLayout
      left={
        <aside className="xl:sticky xl:top-18 xl:h-[calc(100vh-9.5rem)] xl:self-start xl:overflow-hidden">
          <SidebarNav mode={sideMode} onChange={setSideMode} />
          {sideMode === "surah" && <SurahSidebar chapters={chapters} activeChapter={currentChapter} onSelectChapter={handleSelectChapter} />}
          {sideMode === "juz" && <JuzSidebar juzs={juzs} chapters={chapters} activeChapter={currentChapter} onSelectChapter={handleSelectChapter} />}
          {sideMode === "page" && <PageSidebar />}
        </aside>
      }
      center={
        <section className="relative space-y-2.5 pb-8">
          <div className="surface sticky top-17 z-10 p-3.5">
            <div className="flex items-center justify-between">
              <h1 className="text-[1.35rem] font-semibold">Surah {currentChapter}</h1>
              <span className="badge">{verseLoading ? "Loading..." : `${renderedVerses.length} ayahs loaded`}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{error ? "Fallback mode with mock data" : "Live mode connected to backend structure"}</p>
          </div>

          {verseLoading && (
            <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-black/20 backdrop-blur-[1px]">
              <div className="space-y-2.5 p-2">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="surface animate-pulse p-4">
                    <div className="mb-3 h-4 w-24 rounded bg-(--line)" />
                    <div className="mb-4 ml-auto h-8 w-2/3 rounded bg-(--line)" />
                    <div className="mb-2 h-4 w-4/5 rounded bg-(--line)" />
                    <div className="h-4 w-3/5 rounded bg-(--line)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {playbackVerses.map((v, idx) => {
            const arabic = settings.script === "indopak" ? v.text_indopak : settings.script === "tajweed" ? v.text_uthmani_tajweed : v.text_uthmani;
            const current = queue[currentIndex];
            const active = Boolean(
              current &&
                ((current.verse_key && v.verse_key && current.verse_key === v.verse_key) ||
                  (typeof current.id === "number" && typeof v.id === "number" && current.id === v.id))
            );
            const activeWordIndex = getActiveWordIndex(v, active);

            return (
              <VerseCard
                key={v.id}
                domId={`verse-${v.verse_key.replace(":", "-")}`}
                verse={v}
                arabic={arabic}
                active={active}
                isPlaying={playing}
                activeWordIndex={activeWordIndex}
                arabicFontSize={settings.arabicFontSize}
                translationFontSize={settings.translationFontSize}
                lineHeight={settings.lineHeight}
                showTranslation={settings.showTranslation}
                onPlay={() => {
                  setQueue(playbackVerses, idx);
                  setPlaying(true);
                  saveLastRead(currentChapter, v.verse_key, v.verse_number);
                }}
                onBookmark={() =>
                  addBookmark({
                    folder: "Default",
                    verseKey: v.verse_key,
                    chapterNumber: currentChapter,
                    ayahNumber: v.verse_number,
                    arabic: arabic ?? "",
                    translation: v.translations?.[0]?.text,
                    createdAt: new Date().toISOString(),
                  })
                }
                onCopyArabic={() => navigator.clipboard.writeText(arabic ?? "")}
                onCopyTranslation={() => navigator.clipboard.writeText(v.translations?.[0]?.text ?? "")}
              />
            );
          })}
        </section>
      }
      right={<SettingsPanel settings={settings} />}
    />
  );
}
