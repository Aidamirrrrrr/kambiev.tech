import { describe, expect, it } from "vitest";
import {
  detectContactKind,
  formatPhone,
  isContactValid,
} from "./contact-field";

describe("detectContactKind", () => {
  it.each([
    ["ivan@mail.ru", "email"],
    ["Ivan.Petrov+tag@sub.example.co", "email"],
    ["@aidamirkambiev", "telegram"],
    ["t.me/aidamirkambiev", "telegram"],
    ["https://t.me/aidamirkambiev", "telegram"],
    ["+7 999 123-45-67", "phone"],
    ["89991234567", "phone"],
    ["", "unknown"],
    ["просто текст", "unknown"],
  ] as const)("%s -> %s", (input, expected) => {
    expect(detectContactKind(input)).toBe(expected);
  });

  it("ник с собакой не принимает за почту", () => {
    // Порядок проверок: «@ivan» содержит @, но это не адрес.
    expect(detectContactKind("@ivan_petrov")).toBe("telegram");
  });
});

describe("formatPhone", () => {
  it("собирает номер по мере набора", () => {
    expect(formatPhone("9")).toBe("+7 (9");
    expect(formatPhone("999")).toBe("+7 (999)");
    expect(formatPhone("999123")).toBe("+7 (999) 123");
    expect(formatPhone("9991234567")).toBe("+7 (999) 123-45-67");
  });

  it("восьмёрку в начале приводит к семёрке", () => {
    expect(formatPhone("89991234567")).toBe("+7 (999) 123-45-67");
    expect(formatPhone("79991234567")).toBe("+7 (999) 123-45-67");
  });

  it("не растёт сверх одиннадцати цифр", () => {
    expect(formatPhone("899912345679999")).toBe("+7 (999) 123-45-67");
  });

  it("уже отформатированный номер не ломает", () => {
    expect(formatPhone("+7 (999) 123-45-67")).toBe("+7 (999) 123-45-67");
  });

  it("пустой ввод не превращает в +7", () => {
    expect(formatPhone("")).toBe("");
  });
});

describe("isContactValid", () => {
  it.each([
    "ivan@mail.ru",
    "@aidamirkambiev",
    "t.me/aidamirkambiev",
    "+7 (999) 123-45-67",
    "89991234567",
  ])("принимает %s", (value) => {
    expect(isContactValid(value)).toBe(true);
  });

  it.each([
    ["пустое", ""],
    ["почта без домена", "ivan@"],
    ["почта без зоны", "ivan@mail"],
    ["слишком короткий ник", "@ivan"],
    ["ник с точкой", "@ivan.petrov"],
    ["неполный номер", "+7 (999) 123"],
    ["просто слово", "напишите"],
  ])("отклоняет: %s", (_case, value) => {
    expect(isContactValid(value)).toBe(false);
  });
});
