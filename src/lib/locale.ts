export const SUPPORTED_LOCALES = ["ru", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isLocale(value: unknown): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

/** Русский по умолчанию: сайт прежде всего для местного рынка. */
export function parseAcceptLanguage(header: string): Locale {
  const languages = header
    .split(",")
    .map((part) => {
      const [lang = "", q] = part.trim().split(";q=");
      const weight = q ? Number.parseFloat(q) : 1;
      return {
        lang: lang.trim().toLowerCase(),
        // Некорректный q не должен утаскивать язык в начало списка.
        q: Number.isFinite(weight) ? weight : 0,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("en")) return "en";
  }

  return "ru";
}
