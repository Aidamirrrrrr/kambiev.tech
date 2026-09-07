/**
 * Технологический стек: данные лежат в JSON, типы и проверка здесь.
 *
 * Список правится чаще вёрстки, поэтому вынесен из компонента. Ключи категорий
 * заданы объединением явно, а не выведены из данных: из JSON вывелся бы просто
 * string, и карта переводов перестала бы требовать полноты.
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
 * JSON не проверяется компилятором, поэтому ключи сверяем при загрузке модуля.
 * Это страховка на случай правки данных в проде: страница рендерится по запросу,
 * так что до сборки проверка не доходит. Опечатку ловит тест в CI.
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
