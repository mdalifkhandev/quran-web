import { NextRequest, NextResponse } from "next/server";
import { qfConfig } from "@/lib/quran-foundation/config";
import { clearTokenCache, getAccessToken } from "@/lib/quran-foundation/token";

async function run(url: string) {
  const token = await getAccessToken();
  return fetch(url, {
    headers: {
      "x-auth-token": token,
      "x-client-id": qfConfig.clientId,
    },
    cache: "no-store",
  });
}

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode") ?? "quick";
  const query = req.nextUrl.searchParams.get("query") ?? "";
  const page = req.nextUrl.searchParams.get("page") ?? "1";
  const size = req.nextUrl.searchParams.get("size") ?? "30";
  const language = req.nextUrl.searchParams.get("language") ?? "en";
  const translationIds =
    req.nextUrl.searchParams.get("translation_ids") ??
    req.nextUrl.searchParams.get("filter_translations") ??
    "";
  const exactMatchesOnly = req.nextUrl.searchParams.get("exact_matches_only") ?? "0";
  const getText = req.nextUrl.searchParams.get("get_text") ?? "1";
  const highlight = req.nextUrl.searchParams.get("highlight") ?? "1";
  const indexes = req.nextUrl.searchParams.get("indexes") ?? "quran,translations";
  const navigationalResultsNumber = req.nextUrl.searchParams.get("navigationalResultsNumber") ?? "5";
  const versesResultsNumber = req.nextUrl.searchParams.get("versesResultsNumber") ?? "20";

  if (!query.trim()) {
    return NextResponse.json({ pagination: null, result: { navigation: [], verses: [] } });
  }

  const sp = new URLSearchParams();
  sp.set("mode", mode);
  sp.set("query", query);
  sp.set("language", language);
  sp.set("page", page);
  sp.set("size", size);
  sp.set("highlight", highlight);
  sp.set("get_text", getText);
  if (translationIds) sp.set("translation_ids", translationIds);
  if (mode === "advanced") sp.set("exact_matches_only", exactMatchesOnly);
  if (mode === "quick") {
    sp.set("navigationalResultsNumber", navigationalResultsNumber);
    sp.set("versesResultsNumber", versesResultsNumber);
    sp.set("indexes", indexes);
  }

  const url = `${qfConfig.apiBaseUrl}/search/api/v1/search?${sp.toString()}`;
  let response = await run(url);
  if (response.status === 401) {
    clearTokenCache();
    response = await run(url);
  }

  const payload = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { message: "Quran search API failed", status: response.status, payload },
      { status: response.status },
    );
  }

  return NextResponse.json(payload);
}
