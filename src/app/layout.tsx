import type { Metadata } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ThemeSync } from "@/components/layout/theme-sync";
import { TopNav } from "@/components/layout/top-nav";
import { AudioPlayerBar } from "@/components/layout/audio-player-bar";
import { AppQueryProvider } from "@/components/layout/query-provider";

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "Quran Companion",
  description: "Quran reading companion with translations, tafsir, bookmarks, and offline cache.",
  other: { google: "notranslate" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={notoNaskhArabic.variable}>
      <body>
        <ThemeProvider>
          <AppQueryProvider>
            <ThemeSync />
            <TopNav />
            <main className="mx-auto w-full max-w-470 px-3 py-3">
              <section>{children}</section>
            </main>
            <AudioPlayerBar />
          </AppQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
