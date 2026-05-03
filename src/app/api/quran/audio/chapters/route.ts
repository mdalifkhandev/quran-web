import { NextRequest, NextResponse } from "next/server";
import { qfFetch } from "@/lib/quran-foundation/client";

type ChapterRecitation = {
  id: number;
  chapter_id?: number;
  chapterId?: number;
  file_size?: number;
  fileSize?: number;
  format?: string;
  audio_url?: string;
  audioUrl?: string;
};

async function tryPaths(paths: string[]) {
  for (const p of paths) {
    try {
      return await qfFetch<{ audio_files?: ChapterRecitation[]; chapter_recitations?: ChapterRecitation[] }>(p);
    } catch {
      // try next known path variant
    }
  }
  throw new Error("Unable to fetch chapter recitations from Quran Foundation audio API.");
}

export async function GET(req: NextRequest) {
  const chapter = req.nextUrl.searchParams.get("chapter") ?? "1";
  const recitationId = req.nextUrl.searchParams.get("recitationId") ?? "7";

  const data = await tryPaths([
    `/chapter_recitations/${recitationId}?chapter=${chapter}`,
    `/audio/chapter_recitations/${recitationId}?chapter=${chapter}`,
    `/resources/chapter_recitations/${recitationId}?chapter=${chapter}`,
  ]);

  const items = data.audio_files ?? data.chapter_recitations ?? [];

  const normalized = items.map((x) => ({
    id: x.id,
    chapterId: x.chapterId ?? x.chapter_id ?? Number(chapter),
    fileSize: x.fileSize ?? x.file_size ?? 0,
    format: x.format ?? "mp3",
    audioUrl: x.audioUrl ?? x.audio_url ?? "",
  }));

  return NextResponse.json({ recitations: normalized });
}
