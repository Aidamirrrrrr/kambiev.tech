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

  /*
   * Раньше семёрка подставлялась любому номеру без неё, и «+49 151 2345678»
   * молча становился «+7 (491) 512-34-56»: не отказ, а подмена, которая ещё и
   * проходила проверку. Владелец сайта получал номер, по которому не дозвониться.
   */
  it.each([
    ["Германия", "+49 151 2345678"],
    ["Украина", "+380 67 123 4567"],
    ["Беларусь", "+375 29 123 45 67"],
    ["США", "+1 415 555 0123"],
    ["Турция", "+90 532 123 45 67"],
  ])("не переписывает чужой код страны: %s", (_case, value) => {
    expect(formatPhone(value)).toBe(value);
  });

  it("плюс с семёркой это всё ещё российский номер", () => {
    expect(formatPhone("+7 999 123 45 67")).toBe("+7 (999) 123-45-67");
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

  it.each(["+49 151 2345678", "+380 67 123 4567", "+1 415 555 0123"])(
    "принимает иностранный номер %s",
    (value) => {
      expect(isContactValid(value)).toBe(true);
    },
  );

  it.each([
    ["пустое", ""],
    ["почта без домена", "ivan@"],
    ["почта без зоны", "ivan@mail"],
    ["слишком короткий ник", "@ivan"],
    ["ник с точкой", "@ivan.petrov"],
    ["неполный номер", "+7 (999) 123"],
    ["слишком короткий иностранный", "+49 151"],
    ["длиннее, чем допускает E.164", "+49 1234567890123456"],
    ["просто слово", "напишите"],
  ])("отклоняет: %s", (_case, value) => {
    expect(isContactValid(value)).toBe(false);
  });
});
