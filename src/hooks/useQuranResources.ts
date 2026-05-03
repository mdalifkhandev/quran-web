"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { cacheGet, cacheSet } from "./useOfflineCache";

type ResourcePayload = Record<string, unknown>;

type ResourceMap = {
  languages: ResourcePayload | null;
  translations: ResourcePayload | null;
  tafsirs: ResourcePayload | null;
  recitations: ResourcePayload | null;
};

const keys = ["languages", "translations", "tafsirs", "recitations"] as const;

async function fetchResources(language: string): Promise<ResourceMap> {
  const cached = await Promise.all(keys.map((k) => cacheGet<ResourcePayload>(`resource:${k}:${language}`)));

  const base = Object.fromEntries(keys.map((k, i) => [k, cached[i] ?? null])) as ResourceMap;

  const responses = await Promise.all(
    keys.map(async (k) => {
      const reqLanguage = k === "languages" ? "en" : language;
      const { data } = await api.get<ResourcePayload>(`/quran/${k}`, { params: { language: reqLanguage } });
      await cacheSet(`resource:${k}:${language}`, data);
      return [k, data] as const;
    }),
  );

  return { ...base, ...Object.fromEntries(responses) };
}

export function useQuranResources(language = "en") {
  const query = useQuery({
    queryKey: ["quran-resources", language],
    queryFn: () => fetchResources(language),
  });

  return {
    data: query.data ?? { languages: null, translations: null, tafsirs: null, recitations: null },
    loading: query.isLoading,
    error: query.error,
  };
}
