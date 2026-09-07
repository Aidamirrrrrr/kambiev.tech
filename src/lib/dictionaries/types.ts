/**
 * Тип словаря выводится из русского: он ведущий, остальные языки обязаны
 * повторять его форму. DeepStringify заменяет литералы на string, иначе
 * английский словарь не подошёл бы по типу к русским литералам.
 */

import type { ru } from "./ru";

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : DeepStringify<T[K]>;
};

export type Dictionary = DeepStringify<typeof ru>;
