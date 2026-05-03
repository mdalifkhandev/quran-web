import { NextRequest, NextResponse } from "next/server";
import { qfFetch } from "@/lib/quran-foundation/client";
export async function GET(req: NextRequest) {
  const language = req.nextUrl.searchParams.get("language") ?? "en";
  return NextResponse.json(await qfFetch(`/resources/tafsirs?language=${language}`));
}
