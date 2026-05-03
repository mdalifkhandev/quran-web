import { NextRequest, NextResponse } from "next/server";
import { qfFetch } from "@/lib/quran-foundation/client";

type VerseAudio = {
  verse_key?: string;
  verseKey?: string;
  url?: string;
  audio_url?: string;
  id?: number;
  chapter_id?: number;
  chapterId?: number;
  segments?: Array<[number, number, number]>;
  format?: string;
};

async function tryPaths(paths: string[]) {
  for (const p of paths) {
    try {
      return await qfFetch<{ audio_files?: VerseAudio[]; verse_recitations?: VerseAudio[] }>(p);
    } catch {
      // try next known path variant
    }
  }
  throw new Error("Unable to fetch verse recitations from Quran Foundation audio API.");
}

export async function GET(req: NextRequest) {
  const chapter = req.nextUrl.searchParams.get("chapter") ?? "1";
  const recitationId = req.nextUrl.searchParams.get("recitationId") ?? "7";
  const perPage = req.nextUrl.searchParams.get("perPage") ?? "50";
  const page = req.nextUrl.searchParams.get("page") ?? "1";

  const data = await tryPaths([
    `/recitations/${recitationId}/by_chapter/${chapter}?per_page=${perPage}&page=${page}`,
    `/audio/recitations/${recitationId}/by_chapter/${chapter}?per_page=${perPage}&page=${page}`,
    `/verse_recitations/${recitationId}/by_chapter/${chapter}?per_page=${perPage}&page=${page}`,
  ]);

  const files = data.audio_files ?? data.verse_recitations ?? [];

  const normalized = files.map((x) => ({
    verseKey: x.verseKey ?? x.verse_key ?? "",
    url: x.url ?? x.audio_url ?? "",
    id: x.id ?? 0,
    chapterId: x.chapterId ?? x.chapter_id ?? Number(chapter),
    segments: x.segments,
    format: x.format ?? "mp3",
  }));

  return NextResponse.json({ audioFiles: normalized });
}
