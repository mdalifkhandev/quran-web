"use client";
import { create } from "zustand";
import type { Verse } from "@/lib/types";

type State = {
  queue: Verse[];
  currentIndex: number;
  playing: boolean;
  currentTimeMs: number;
  durationMs: number;
  error?: string;
  setQueue: (queue: Verse[], start: number) => void;
  setPlaying: (playing: boolean) => void;
  next: () => void;
  prev: () => void;
  setCurrentTimeMs: (ms: number) => void;
  setDurationMs: (ms: number) => void;
  setError: (error?: string) => void;
};

export const useAudioPlayer = create<State>((set) => ({
  queue: [],
  currentIndex: 0,
  playing: false,
  currentTimeMs: 0,
  durationMs: 0,
  setQueue: (queue, start) => set({ queue, currentIndex: start }),
  setPlaying: (playing) => set({ playing }),
  next: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, Math.max(0, s.queue.length - 1)) })),
  prev: () => set((s) => ({ currentIndex: Math.max(0, s.currentIndex - 1) })),
  setCurrentTimeMs: (currentTimeMs) => set({ currentTimeMs }),
  setDurationMs: (durationMs) => set({ durationMs }),
  setError: (error) => set({ error }),
}));
