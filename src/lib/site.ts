/**
 * Единственный источник правды по адресам и контактам.
 *
 * Раньше домен, почта и ссылки на профили были продублированы в метаданных,
 * структурированных данных, карте сайта, robots, llms.txt, секции контактов
 * и политике конфиденциальности. Смена почты требовала обхода семи файлов.
 */

export const site = {
  url: "https://kambiev.tech",
  domain: "kambiev.tech",
  name: "Aidamir Kambiev",
  nameRu: "Айдамир Камбиев",
  title: "Aidamir Kambiev, Fullstack Engineer",
  jobTitle: "Fullstack Engineer",
  email: "hello@kambiev.tech",
  telegram: "https://t.me/aidamirkambiev",
  github: "https://github.com/Aidamirrrrrr",
  city: "Saint Petersburg",
  countryCode: "RU",
} as const;

/** Абсолютный адрес страницы сайта. Путь начинается со слэша. */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}
