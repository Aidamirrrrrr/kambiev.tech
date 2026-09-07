import { describe, expect, it } from "vitest";
import { escapeHtml, MAX_MESSAGE_LENGTH, truncate } from "./telegram";

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
