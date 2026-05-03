import { NextResponse } from "next/server";
import { qfFetch } from "@/lib/quran-foundation/client";

export async function GET() {
  const data = await qfFetch("/chapters");
  return NextResponse.json(data);
}
