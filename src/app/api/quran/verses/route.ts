import { NextRequest, NextResponse } from "next/server";
import { qfFetch } from "@/lib/quran-foundation/client";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const chapter = p.get("chapter") ?? "1";
  const page = p.get("page") ?? "1";
  const perPage = p.get("perPage") ?? "50";
  const language = p.get("language") ?? "bn";
  const translations = p.get("translations") ?? "";
  const audio = p.get("audio") ?? "";
  const tafsirs = p.get("tafsirs") ?? "";
  const words = p.get("words") ?? "false";

  const path = `/verses/by_chapter/${chapter}?language=${language}&words=${words}&translations=${translations}&audio=${audio}&tafsirs=${tafsirs}&fields=text_uthmani,text_indopak,text_uthmani_tajweed,page_number,juz_number,hizb_number,rub_el_hizb_number&per_page=${perPage}&page=${page}`;
  return NextResponse.json(await qfFetch(path));
}
