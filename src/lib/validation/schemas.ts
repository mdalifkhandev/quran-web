import { z } from "zod";

export const chapterSchema = z.object({
  id: z.number(),
  revelation_place: z.string(),
  revelation_order: z.number(),
  bismillah_pre: z.boolean(),
  name_simple: z.string(),
  name_complex: z.string(),
  name_arabic: z.string(),
  verses_count: z.number(),
  translated_name: z.object({ language_name: z.string(), name: z.string() }),
});

export const verseSchema = z.object({
  id: z.number(),
  verse_key: z.string(),
  verse_number: z.number(),
  text_uthmani: z.string().optional(),
  text_indopak: z.string().optional(),
  text_uthmani_tajweed: z.string().optional(),
  words: z.array(z.any()).optional(),
  translations: z.array(z.object({ resource_id: z.number(), text: z.string() })).optional(),
  tafsirs: z.array(z.object({ resource_id: z.number(), text: z.string() })).optional(),
  audio: z.object({ url: z.string().optional() }).optional(),
});

export const qfListSchema = <T extends z.ZodTypeAny>(key: string, item: T) =>
  z.object({ [key]: z.array(item) } as Record<string, z.ZodArray<T>>);
