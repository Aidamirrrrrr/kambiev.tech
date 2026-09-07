import { describe, expect, it } from "vitest";
import { isLocale, parseAcceptLanguage } from "./locale";

describe("parseAcceptLanguage", () => {
  it.each([
    ["ru-RU,ru;q=0.9,en;q=0.8", "ru"],
    ["en-US,en;q=0.9", "en"],
    ["en;q=0.4,ru;q=0.9", "ru"],
    ["ru;q=0.2,en;q=0.8", "en"],
    ["de-DE,fr;q=0.7", "ru"],
    ["", "ru"],
  ])("%s -> %s", (header, expected) => {
    expect(parseAcceptLanguage(header)).toBe(expected);
  });

  it("не падает на мусорном заголовке", () => {
    expect(parseAcceptLanguage(",,;q=,")).toBe("ru");
    expect(parseAcceptLanguage(";;;")).toBe("ru");
  });

  it("не поднимает язык с нечисловым весом наверх", () => {
    // Без защиты NaN сортировка ставила бы такой язык произвольно.
    expect(parseAcceptLanguage("en;q=abc,ru;q=0.5")).toBe("ru");
  });
});

describe("isLocale", () => {
  it("пропускает только поддерживаемые языки", () => {
    expect(isLocale("ru")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
