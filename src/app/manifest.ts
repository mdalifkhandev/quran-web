import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quran Companion",
    short_name: "QuranCompanion",
    description: "Quran reading web app with translation, tafsir, audio and offline cache.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e5",
    theme_color: "#0f766e",
    icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  };
}
