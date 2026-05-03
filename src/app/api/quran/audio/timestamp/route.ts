import { NextRequest, NextResponse } from "next/server";
import { qfFetch } from "@/lib/quran-foundation/client";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const reciterId = p.get("reciterId") ?? "7";
  const chapterNumber = p.get("chapter_number");
  const verseKey = p.get("verse_key");
  const verseId = p.get("verse_id");
  const word = p.get("word");
  const wordFrom = p.get("word_from");
  const wordTo = p.get("word_to");

  const query = new URLSearchParams();
  if (chapterNumber) query.set("chapter_number", chapterNumber);
  if (verseKey) query.set("verse_key", verseKey);
  if (verseId) query.set("verse_id", verseId);
  if (word) query.set("word", word);
  if (wordFrom) query.set("word_from", wordFrom);
  if (wordTo) query.set("word_to", wordTo);

  const path = `/audio/reciters/${reciterId}/timestamp?${query.toString()}`;
  const data = await qfFetch(path);
  return NextResponse.json(data);
}
