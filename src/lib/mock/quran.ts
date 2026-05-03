import type { Chapter, Juz, Verse } from "@/lib/types";

export const mockChapters: Chapter[] = [
  { id: 1, revelation_place: "makkah", revelation_order: 5, bismillah_pre: false, name_simple: "Al-Fatihah", name_complex: "Al-Fatihah", name_arabic: "الفاتحة", verses_count: 7, translated_name: { language_name: "english", name: "The Opening" } },
  { id: 2, revelation_place: "madinah", revelation_order: 87, bismillah_pre: true, name_simple: "Al-Baqarah", name_complex: "Al-Baqarah", name_arabic: "البقرة", verses_count: 286, translated_name: { language_name: "english", name: "The Cow" } },
  { id: 3, revelation_place: "madinah", revelation_order: 89, bismillah_pre: true, name_simple: "Ali 'Imran", name_complex: "Ali 'Imran", name_arabic: "آل عمران", verses_count: 200, translated_name: { language_name: "english", name: "Family of Imran" } },
  { id: 4, revelation_place: "madinah", revelation_order: 92, bismillah_pre: true, name_simple: "An-Nisa", name_complex: "An-Nisa", name_arabic: "النساء", verses_count: 176, translated_name: { language_name: "english", name: "The Women" } },
  { id: 5, revelation_place: "madinah", revelation_order: 112, bismillah_pre: true, name_simple: "Al-Ma'idah", name_complex: "Al-Ma'idah", name_arabic: "المائدة", verses_count: 120, translated_name: { language_name: "english", name: "The Table Spread" } },
  { id: 6, revelation_place: "makkah", revelation_order: 55, bismillah_pre: true, name_simple: "Al-An'am", name_complex: "Al-An'am", name_arabic: "الأنعام", verses_count: 165, translated_name: { language_name: "english", name: "The Cattle" } },
  { id: 36, revelation_place: "makkah", revelation_order: 41, bismillah_pre: true, name_simple: "Yasin", name_complex: "Ya-Sin", name_arabic: "يس", verses_count: 83, translated_name: { language_name: "english", name: "Ya Sin" } },
];

export const mockVersesByChapter: Record<number, Verse[]> = {
  1: [
    {
      id: 1,
      verse_key: "1:1",
      verse_number: 1,
      text_uthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translations: [
        { resource_id: 131, text: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
        { resource_id: 85, text: "পরম করুণাময় অসীম দয়ালু আল্লাহর নামে।" },
      ],
    },
    {
      id: 2,
      verse_key: "1:2",
      verse_number: 2,
      text_uthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translations: [
        { resource_id: 131, text: "[All] praise is [due] to Allah, Lord of the worlds." },
        { resource_id: 85, text: "সমস্ত প্রশংসা আল্লাহর, যিনি বিশ্বজগতের প্রতিপালক।" },
      ],
    },
  ],
  4: [
    {
      id: 8001,
      verse_key: "4:148",
      verse_number: 148,
      text_uthmani: "لَّا يُحِبُّ اللَّهُ الْجَهْرَ بِالسُّوءِ مِنَ الْقَوْلِ إِلَّا مَن ظُلِمَ ۚ وَكَانَ اللَّهُ سَمِيعًا عَلِيمًا",
      translations: [
        { resource_id: 131, text: "Allah does not like the public mention of evil except by one who has been wronged. And ever is Allah Hearing and Knowing." },
        { resource_id: 85, text: "অত্যাচারিত ব্যক্তি ছাড়া প্রকাশ্যে মন্দ কথা বলাকে আল্লাহ পছন্দ করেন না; আল্লাহ সর্বশ্রোতা, সর্বজ্ঞ।" },
      ],
    },
    {
      id: 8002,
      verse_key: "4:149",
      verse_number: 149,
      text_uthmani: "إِن تُبْدُوا خَيْرًا أَوْ تُخْفُوهُ أَوْ تَعْفُوا عَن سُوءٍ فَإِنَّ اللَّهَ كَانَ عَفُوًّا قَدِيرًا",
      translations: [
        { resource_id: 131, text: "If [instead] you show [some] good or conceal it or pardon an offense - indeed, Allah is ever Pardoning and Competent." },
        { resource_id: 85, text: "তোমরা প্রকাশ্যে সৎকর্ম করো বা গোপন করো, কিংবা অপরাধ ক্ষমা করো, নিশ্চয়ই আল্লাহ পরম ক্ষমাশীল, সর্বশক্তিমান।" },
      ],
    },
    {
      id: 8003,
      verse_key: "4:150",
      verse_number: 150,
      text_uthmani: "إِنَّ الَّذِينَ يَكْفُرُونَ بِاللَّهِ وَرُسُلِهِ وَيُرِيدُونَ أَن يُفَرِّقُوا بَيْنَ اللَّهِ وَرُسُلِهِ",
      translations: [
        { resource_id: 131, text: "Indeed, those who disbelieve in Allah and His messengers and wish to discriminate between Allah and His messengers..." },
        { resource_id: 85, text: "নিশ্চয় যারা আল্লাহ ও তাঁর রাসূলগণের সাথে কুফরি করে এবং আল্লাহ ও রাসূলদের মাঝে পার্থক্য করতে চায়..." },
      ],
    },
  ],
};

export const mockJuzs: Juz[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  juz_number: i + 1,
  verse_mapping: i === 0 ? { "1:1": "1:7", "2:1": "2:141" } : { "2:142": "2:252" },
  first_verse_id: i * 200 + 1,
  last_verse_id: i * 200 + 200,
  verses_count: 200,
}));
