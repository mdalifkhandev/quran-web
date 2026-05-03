import Link from "next/link";
import type { Juz } from "@/lib/types";
import { qfFetch } from "@/lib/quran-foundation/client";

async function getJuzs(): Promise<Juz[]> {
  const json = await qfFetch<{ juzs?: Juz[] }>("/juzs");
  return json.juzs ?? [];
}

export default async function JuzPage() {
  const juzs = await getJuzs();

  return (
    <div className="space-y-4 pb-5">
      <h1 className="text-2xl font-semibold">Juz Index</h1>
      <p className="text-sm text-muted-foreground">Browse all 30 Juz with verse mapping boundaries.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {juzs.map((j) => {
          const mappings = Object.entries(j.verse_mapping ?? {}).slice(0, 2);
          return (
            <article key={j.id} className="surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">Juz {j.juz_number}</h2>
                <span className="badge">{j.verses_count} ayahs</span>
              </div>
              <p className="text-xs text-muted-foreground">Verse ID range: {j.first_verse_id} - {j.last_verse_id}</p>
              <div className="mt-2 space-y-1 text-sm">
                {mappings.map(([start, end]) => (
                  <p key={start}>{start} to {end}</p>
                ))}
              </div>
              <div className="mt-3">
                <Link href={`/surah/${(mappings[0]?.[0] ?? "1:1").split(":")[0]}`} className="btn">Open First Surah Segment</Link>
              </div>
            </article>
          );
        })}
      </div>
      {juzs.length === 0 && <section className="surface p-4 text-sm text-muted-foreground">No Juz data loaded yet.</section>}
    </div>
  );
}
