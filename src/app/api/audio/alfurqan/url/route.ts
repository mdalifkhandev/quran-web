import { NextRequest, NextResponse } from "next/server";
export function GET(req: NextRequest) {
  const reciterId = req.nextUrl.searchParams.get("reciterId");
  const surah = req.nextUrl.searchParams.get("surah");
  const ayah = req.nextUrl.searchParams.get("ayah");
  const url = `https://alfurqan.online/api/v1/audio/${reciterId}/surah/${surah}/ayah/${ayah}`;
  return NextResponse.json({ url });
}
