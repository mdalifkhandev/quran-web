"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bookmark, Search, Settings, Info, Rows3 } from "lucide-react";

const links = [
  ["/", "Home", BookOpen],
  ["/juz", "Juz", Rows3],
  ["/search", "Search", Search],
  ["/bookmarks", "Bookmarks", Bookmark],
  ["/settings", "Settings", Settings],
  ["/about", "About", Info],
] as const;

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1880px] items-center justify-between gap-3 px-3">
        <div>
          <Link href="/" className="text-[1.65rem] font-extrabold tracking-tight leading-none">Quran Companion</Link>
          <p className="text-[11px] text-muted-foreground">Read, study and listen with focus</p>
        </div>

        <nav dir="rtl" className="hidden flex-wrap items-center justify-end gap-1.5 text-sm lg:flex">
          {links.map(([href, label, Icon]) => {
            const active = label === "Home" ? pathname === "/" || pathname.startsWith("/surah/") : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={active ? "btn btn-brand inline-flex h-8 items-center gap-1.5 [direction:ltr]" : "btn inline-flex h-8 items-center gap-1.5 [direction:ltr]"}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </nav>

        <nav className="flex flex-wrap items-center justify-end gap-1.5 text-sm lg:hidden">
          {links.map(([href, label, Icon]) => {
            const active = label === "Home" ? pathname === "/" || pathname.startsWith("/surah/") : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={active ? "btn btn-brand inline-flex h-8 items-center gap-1.5" : "btn inline-flex h-8 items-center gap-1.5"}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
