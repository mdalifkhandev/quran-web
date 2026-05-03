"use client";
import { useEffect, useRef } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useAudioPlayer } from "@/store/useAudioPlayer";

export function AudioPlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { queue, currentIndex, playing, setPlaying, next, prev, setCurrentTimeMs, setDurationMs } = useAudioPlayer();
  const current = queue[currentIndex];

  useEffect(() => {
    if (!audioRef.current || !current?.audio?.url) return;
    audioRef.current.src = current.audio.url;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [current?.audio?.url, playing, setPlaying]);

  return (
    <div className="sticky bottom-0 z-30 border-t bg-background/96 px-3 py-2 backdrop-blur">
      <audio
        ref={audioRef}
        onEnded={next}
        onError={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDurationMs(Math.floor((e.currentTarget.duration || 0) * 1000))}
        onTimeUpdate={(e) => setCurrentTimeMs(Math.floor(e.currentTarget.currentTime * 1000))}
      />
      <div className="surface mx-auto grid max-w-[1880px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-1.5 text-sm">
        <div className="inline-flex items-center gap-2 text-muted-foreground justify-self-start">
          <Volume2 size={16} />
          <span className="hidden sm:inline">Now playing:</span>
          <span className="font-medium text-[var(--fg)]">{current?.verse_key ?? "No ayah selected"}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button className="btn inline-flex h-8 w-9 items-center justify-center" onClick={prev} aria-label="Previous ayah"><SkipBack size={14} /></button>
          <button className="btn btn-brand inline-flex h-8 w-10 items-center justify-center" onClick={() => setPlaying(!playing)} aria-label="Play or pause">
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button className="btn inline-flex h-8 w-9 items-center justify-center" onClick={next} aria-label="Next ayah"><SkipForward size={14} /></button>
        </div>
        <div />
      </div>
    </div>
  );
}
