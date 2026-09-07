import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  formatNotification,
  MAX_MESSAGE_LENGTH,
  type NotificationField,
  truncate,
} from "./telegram";

describe("escapeHtml", () => {
  it("обезвреживает разметку", () => {
    expect(escapeHtml('<a href="x">ссылка</a>')).toBe(
      '&lt;a href="x"&gt;ссылка&lt;/a&gt;',
    );
  });

  it("экранирует амперсанд первым, иначе получится двойное экранирование", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("не трогает обычный текст", () => {
    expect(escapeHtml("Привет, мир")).toBe("Привет, мир");
  });
});

describe("truncate", () => {
  it("оставляет короткий текст как есть", () => {
    expect(truncate("коротко", 100)).toBe("коротко");
  });

  it("режет длинный и помечает усечение", () => {
    const result = truncate("я".repeat(50), 10);
    expect(result).toHaveLength(10);
    expect(result.endsWith("…")).toBe(true);
  });

  it("предел Telegram не превышается", () => {
    expect(
      truncate("я".repeat(MAX_MESSAGE_LENGTH * 2), MAX_MESSAGE_LENGTH),
    ).toHaveLength(MAX_MESSAGE_LENGTH);
  });
});

describe("formatNotification", () => {
  const base = {
    title: "Письмо на почту",
    fields: [
      ["Кому", "hello@kambiev.tech"],
      ["От", "Иван <ivan@mail.ru>"],
      ["Тема", "Вопрос"],
    ] as NotificationField[],
    body: "Здравствуйте",
  };

  it("собирает шапку и цитату", () => {
    expect(formatNotification(base)).toBe(
      [
        "<b>ПИСЬМО НА ПОЧТУ</b>",
        "",
        "<b>Кому:</b> hello@kambiev.tech",
        "<b>От:</b> Иван &lt;ivan@mail.ru&gt;",
        "<b>Тема:</b> Вопрос",
        "",
        "<blockquote expandable>Здравствуйте</blockquote>",
      ].join("\n"),
    );
  });

  it("пропускает поля без значения", () => {
    const text = formatNotification({
      ...base,
      fields: [...base.fields, ["Вложения", undefined], ["Копия", "  "]],
    });
    expect(text).not.toContain("Вложения");
    expect(text).not.toContain("Копия");
  });

  it("обходится без цитаты, если текста нет", () => {
    const text = formatNotification({ ...base, body: "   " });
    expect(text).not.toContain("blockquote");
    expect(text.endsWith("<b>Тема:</b> Вопрос")).toBe(true);
  });

  /*
   * Telegram отклоняет сообщение целиком, если разметка не закрыта, поэтому
   * длинный текст режется до отправки, а не blind-обрезкой уже собранной
   * строки: та отрубила бы </blockquote>.
   */
  it("укладывается в предел Telegram вместе с разметкой", () => {
    const text = formatNotification({ ...base, body: "я".repeat(10_000) });

    expect(text.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH);
    expect(text.endsWith("…</blockquote>")).toBe(true);
  });

  it("не разрубает экранированную сущность пополам", () => {
    const text = formatNotification({
      ...base,
      body: `${"я".repeat(4020)}&&&`,
    });

    expect(text.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH);
    expect(text).not.toMatch(/&(?!amp;|lt;|gt;)/);
  });
});
