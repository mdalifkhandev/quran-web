export default function AboutPage() {
  return (
    <div className="space-y-4 pb-5">
      <h1 className="text-2xl font-semibold">About Quran Companion</h1>
      <section className="surface space-y-3 p-4 text-sm leading-6">
        <p>Quran Companion is a focused Qur&apos;an reading app with authenticated Arabic text, translations, tafsir, audio playback, bookmarks, and offline cache support.</p>
        <p>We do not auto-translate Qur&apos;an text or vetted scholarly translations.</p>
      </section>

      <section className="surface p-4">
        <h2 className="font-medium">Data Sources</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          <li>Quran Foundation / Quran.com Content API (primary)</li>
          <li>Al Furqan API for fallback reciter audio URLs</li>
          <li>QuranEnc API structure for fallback translations</li>
        </ul>
      </section>

      <section className="surface p-4 text-sm text-muted-foreground">
        Translations and tafsir are human scholarly resources and should never be machine auto-translated.
      </section>
    </div>
  );
}
