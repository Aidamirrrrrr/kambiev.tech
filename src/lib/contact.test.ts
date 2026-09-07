import { describe, expect, it } from "vitest";
import { formatMessage, parsePayload } from "./contact";

const valid = {
  name: "Айдамир",
  contact: "@aidamirkambiev",
  message: "Привет",
  locale: "ru",
};

describe("parsePayload", () => {
  it("принимает корректную заявку", () => {
    expect(parsePayload(valid)).toEqual(valid);
  });

  it.each([
    ["не объект", "строка"],
    ["null", null],
    ["имя числом", { ...valid, name: 42 }],
    ["сообщение объектом", { ...valid, message: {} }],
    ["пустое имя", { ...valid, name: "   " }],
    ["пустое сообщение", { ...valid, message: "\n\t" }],
    ["слишком короткий контакт", { ...valid, contact: "ab" }],
    ["нет полей", {}],
  ])("отклоняет: %s", (_case, body) => {
    expect(parsePayload(body)).toBeNull();
  });

  it("обрезает поля до предела, а не отклоняет их", () => {
    const parsed = parsePayload({ ...valid, message: "я".repeat(5000) });
    expect(parsed?.message).toHaveLength(3000);
  });

  it("схлопывает незнакомую локаль в русскую", () => {
    expect(parsePayload({ ...valid, locale: "de" })?.locale).toBe("ru");
    expect(parsePayload({ ...valid, locale: "en" })?.locale).toBe("en");
  });
});

describe("formatMessage", () => {
  it("экранирует разметку в пользовательском вводе", () => {
    const text = formatMessage({
      ...valid,
      name: "<b>жирный</b>",
      message: "<script>alert(1)</script>",
    });

    // Собственная разметка сообщения остаётся, пользовательская обезврежена.
    expect(text).toContain("<b>Имя:</b>");
    expect(text).not.toContain("<script>");
    expect(text).toContain("&lt;script&gt;");
    expect(text).toContain("&lt;b&gt;жирный&lt;/b&gt;");
  });

  it("переключает язык шапки", () => {
    expect(formatMessage(valid)).toContain("Новая заявка");
    expect(formatMessage({ ...valid, locale: "en" })).toContain("New inquiry");
  });
});
