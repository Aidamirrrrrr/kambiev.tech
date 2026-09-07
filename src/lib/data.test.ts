/**
 * Проверки данных, которые компилятор сделать не может.
 *
 * stack.json не типизирован на уровне значений, а страница рендерится
 * по запросу, поэтому опечатка в данных до сборки не доходит. Ловим здесь.
 */

import { describe, expect, it } from "vitest";
import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import { techCategories } from "./stack";

/** Плоский список путей до всех строковых значений словаря. */
function paths(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return [prefix];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => paths(item, `${prefix}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      paths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [];
}

describe("словари", () => {
  it("совпадают по набору ключей", () => {
    expect(paths(en).sort()).toEqual(paths(ru).sort());
  });

  it("не содержат пустых строк", () => {
    for (const [name, dict] of [
      ["ru", ru],
      ["en", en],
    ] as const) {
      const empty = paths(dict).filter((path) => {
        const value = path
          .replace(/\[(\d+)\]/g, ".$1")
          .split(".")
          .reduce<unknown>((acc, key) => (acc as never)[key], dict);
        return typeof value === "string" && value.trim() === "";
      });
      expect(empty, `пустые значения в ${name}`).toEqual([]);
    }
  });

  it("не содержат длинных тире", () => {
    expect(JSON.stringify(ru)).not.toContain("—");
    expect(JSON.stringify(en)).not.toContain("—");
  });
});

describe("стек", () => {
  it("категории заданы известными ключами", () => {
    expect(techCategories.map((c) => c.key)).toEqual([
      "frontend",
      "backend",
      "tools",
      "infra",
    ]);
  });

  it("у каждой технологии есть название и рабочая ссылка", () => {
    for (const category of techCategories) {
      for (const item of category.items) {
        expect(item.name.trim()).not.toBe("");
        expect(item.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("названия не повторяются", () => {
    const names = techCategories.flatMap((c) => c.items.map((i) => i.name));
    expect(new Set(names).size).toBe(names.length);
  });
});
