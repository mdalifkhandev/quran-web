"use client";
import { X } from "lucide-react";

export function SidebarNav({
  mode,
  onChange,
}: {
  mode: "surah" | "juz" | "page";
  onChange: (mode: "surah" | "juz" | "page") => void;
}) {
  return (
    <div className="mb-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="rounded-full border bg-(--bg-soft) p-1">
          <div className="flex items-center gap-1">
            <button className={mode === "surah" ? "rounded-full bg-(--card) px-5 py-1.5 text-sm font-semibold" : "px-5 py-1.5 text-sm text-muted-foreground"} onClick={() => onChange("surah")}>Surah</button>
            <button className={mode === "juz" ? "rounded-full bg-(--card) px-5 py-1.5 text-sm font-semibold" : "px-5 py-1.5 text-sm text-muted-foreground"} onClick={() => onChange("juz")}>Juz</button>
            <button className={mode === "page" ? "rounded-full bg-(--card) px-5 py-1.5 text-sm font-semibold" : "px-5 py-1.5 text-sm text-muted-foreground"} onClick={() => onChange("page")}>Page</button>
          </div>
        </div>
        <button className="btn inline-flex h-8 w-8 items-center justify-center p-0" type="button" aria-label="Close sidebar">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
