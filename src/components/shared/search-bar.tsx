"use client";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="surface flex items-center gap-2 p-3">
      <Search size={16} className="text-muted-foreground" />
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent outline-none" placeholder={placeholder ?? "Search"} />
    </div>
  );
}
