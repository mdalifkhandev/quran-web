"use client";

import { Search } from "lucide-react";

export function PageSidebar() {
  const pages = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="surface hidden h-[calc(100%-3.25rem)] p-3 xl:flex xl:flex-col">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-(--line) bg-(--bg-soft) px-3 py-2">
        <Search size={16} className="text-muted-foreground" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search Page" />
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={p === 1 ? "w-full rounded-2xl border border-(--brand) bg-[color-mix(in_oklab,var(--brand-soft)_45%,transparent)] px-4 py-4 text-left" : "w-full rounded-2xl border border-(--line) px-4 py-4 text-left"}
          >
            <div className="flex items-center gap-3">
              <span className={p === 1 ? "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--brand) text-sm font-bold text-black" : "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--bg-soft) text-sm font-bold text-muted-foreground"}>
                {String(p).padStart(2, "0")}
              </span>
              <p className="text-[1.2rem] font-semibold">Page {String(p).padStart(2, "0")}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
