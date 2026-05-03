export async function getQuranEncTranslationList() {
  const res = await fetch("https://quranenc.com/api/v1/translations/list/", { cache: "no-store" });
  return res.json();
}

export async function getQuranEncLanguageTranslations(language: string, localization: string) {
  const res = await fetch(`https://quranenc.com/api/v1/translations/list/${language}/?localization=${localization}`, { cache: "no-store" });
  return res.json();
}
