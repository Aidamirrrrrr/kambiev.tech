"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import type { Dictionary } from "./dictionaries/types";

export type Locale = "ru" | "en";

const dictionaries = { ru, en } as const;
interface I18nContextType {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

function setCookie(name: string, value: string) {
  // Cookie Store API нет в Safari, а язык нужно сохранить во всех браузерах.
  // Значение не пользовательское: это одна из двух строк, "ru" или "en".
  // biome-ignore lint/suspicious/noDocumentCookie: см. комментарий выше
  document.cookie = `${name}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function I18nProvider({
  children,
  initialLocale = "ru",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("locale", newLocale);
  }, []);

  const t = dictionaries[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
