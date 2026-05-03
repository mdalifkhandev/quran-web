export type Chapter = {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  translated_name: { language_name: string; name: string };
};

export type Language = { id: number; name: string; iso_code: string; native_name: string };
export type Translation = { id: number; name: string; author_name: string; language_name: string; slug: string };
export type Tafsir = { id: number; name: string; author_name: string; language_name: string; slug: string };
export type Recitation = { id: number; reciter_name: string; style?: string };
export type Juz = {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
};

export type Word = {
  id: number;
  position: number;
  text_uthmani?: string;
  text_indopak?: string;
  transliteration?: { text: string; language_name: string };
  translation?: { text: string; language_name: string };
};

export type Verse = {
  id: number;
  verse_key: string;
  verse_number: number;
  hizb_number?: number;
  juz_number?: number;
  page_number?: number;
  rub_el_hizb_number?: number;
  text_uthmani?: string;
  text_indopak?: string;
  text_uthmani_tajweed?: string;
  words?: Word[];
  translations?: Array<{ resource_id: number; text: string; resource_name?: string }>;
  tafsirs?: Array<{ resource_id: number; text: string; resource_name?: string }>;
  audio?: { url?: string; segments?: Array<[number, number, number, number] | [number, number, number]> };
};

export type AudioState = { recitationId?: number; source: "qf" | "alfurqan"; alFurqanReciterId?: string };
export type VerseRecitation = {
  verseKey: string;
  url: string;
  id: number;
  chapterId: number;
  segments?: Array<[number, number, number]>;
  format?: string;
};

export type Bookmark = {
  id?: number;
  folder: string;
  verseKey: string;
  chapterNumber: number;
  ayahNumber: number;
  arabic: string;
  translation?: string;
  note?: string;
  createdAt: string;
};

export type Settings = {
  language: string;
  translationIds: number[];
  tafsirIds: number[];
  recitationId?: number;
  alFurqanReciterId?: string;
  script: "uthmani" | "indopak" | "tajweed";
  arabicFontSize: number;
  translationFontSize: number;
  lineHeight: number;
  theme: "light" | "dark" | "sepia";
  repeatAyahCount: number;
  delayBetweenAyahsMs: number;
  autoNext: boolean;
  showTranslation: boolean;
  showWords: boolean;
  showTafsirButton: boolean;
  compactMode: boolean;
};
