import type { Chapter, Juz, Verse } from "@/lib/types";
import { mockChapters, mockJuzs, mockVersesByChapter } from "@/lib/mock/quran";
import { api } from "@/lib/api-client";

export type QuranDataSource = {
  getChapters: () => Promise<Chapter[]>;
  getJuzs: () => Promise<Juz[]>;
  getVersesByChapter: (
    chapterNumber: number,
    options?: {
      page?: number;
      perPage?: number;
      language?: string;
      translations?: number[];
      tafsirs?: number[];
      audio?: number;
      words?: boolean;
      script?: "uthmani" | "indopak" | "tajweed";
    },
  ) => Promise<Verse[]>;
};

export const mockDataSource: QuranDataSource = {
  getChapters: async () => mockChapters,
  getJuzs: async () => mockJuzs,
  getVersesByChapter: async (chapterNumber: number) => mockVersesByChapter[chapterNumber] ?? [],
};

export const qfDataSource: QuranDataSource = {
  getChapters: async () => {
    const { data } = await api.get<{ chapters?: Chapter[] }>("/quran/chapters");
    return data.chapters ?? [];
  },
  getJuzs: async () => {
    const { data } = await api.get<{ juzs?: Juz[] }>("/quran/juzs");
    return data.juzs ?? [];
  },
  getVersesByChapter: async (chapterNumber, options) => {
    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 50;
    const language = options?.language ?? "bn";
    const words = options?.words ?? false;
    const script = options?.script ?? "uthmani";
    const translations = options?.translations?.join(",") ?? "";
    const tafsirs = options?.tafsirs?.join(",") ?? "";
    const audio = options?.audio ? String(options.audio) : "";

    const { data } = await api.get<{ verses?: Verse[] }>("/quran/verses", {
      params: {
        chapter: chapterNumber,
        page,
        perPage,
        language,
        translations,
        audio,
        tafsirs,
        words,
        script,
      },
    });

    return data.verses ?? [];
  },
};
