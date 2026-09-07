/**
 * Ключи категорий заданы объединением явно, а не выведены из JSON: оттуда
 * вывелся бы просто string, и карта переводов перестала бы требовать полноты.
 */

import raw from "@/data/stack.json";

export type CategoryKey = "frontend" | "backend" | "tools" | "infra";

export type TechItem = {
  name: string;
  detail: string;
  url: string;
  featured?: boolean;
};

export type TechCategory = { key: CategoryKey; items: TechItem[] };

const KNOWN_KEYS: readonly CategoryKey[] = [
  "frontend",
  "backend",
  "tools",
  "infra",
];

/**
 * Страница рендерится по запросу, поэтому до сборки эта проверка не доходит.
 * Опечатку в JSON ловит тест в CI, здесь она страховка для прода.
 */
function assertCategories(value: unknown): asserts value is TechCategory[] {
  if (!Array.isArray(value)) {
    throw new Error("stack.json: ожидался массив категорий");
  }
  for (const category of value) {
    if (!KNOWN_KEYS.includes(category?.key)) {
      throw new Error(
        `stack.json: неизвестный ключ категории «${category?.key}»`,
      );
    }
    if (!Array.isArray(category.items) || category.items.length === 0) {
      throw new Error(`stack.json: категория «${category.key}» пуста`);
    }
  }
}

assertCategories(raw);

export const techCategories: TechCategory[] = raw;
