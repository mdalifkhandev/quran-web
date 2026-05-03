"use client";

import { useParams } from "next/navigation";
import { SurahReaderScreen } from "@/components/reader/surah-reader-screen";

export default function SurahPage() {
  const params = useParams<{ chapterNumber: string }>();
  const parsed = Number(params.chapterNumber);
  const chapterNumber = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  return <SurahReaderScreen chapterNumber={chapterNumber} />;
}

