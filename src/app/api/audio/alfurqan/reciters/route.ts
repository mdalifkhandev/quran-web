import { NextResponse } from "next/server";
export async function GET() {
  const res = await fetch("https://alfurqan.online/api/v1/reciters", { cache: "no-store" });
  const json = await res.json();
  return NextResponse.json(json);
}
