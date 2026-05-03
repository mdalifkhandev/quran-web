"use client";
import { create } from "zustand";
import type { Bookmark } from "@/lib/types";

type BookmarksState = {
  items: Bookmark[];
  setItems: (items: Bookmark[]) => void;
};

export const useBookmarksStore = create<BookmarksState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
