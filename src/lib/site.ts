/** Единственный источник правды по адресам и контактам. */

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

export function absoluteUrl(path = "/"): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}
