"use client";

/**
 * Граница ошибок страницы.
 *
 * Язык берётся из атрибута lang, а не из провайдера: сюда попадают в том числе
 * сбои, случившиеся до того, как провайдер смонтировался.
 */

import { useEffect, useState } from "react";

const copy = {
  ru: {
    title: "Что-то сломалось",
    text: "Страница не отрисовалась. Можно попробовать ещё раз или вернуться на главную.",
    retry: "Попробовать снова",
    home: "На главную",
  },
  en: {
    title: "Something broke",
    text: "The page failed to render. Try again, or go back to the homepage.",
    retry: "Try again",
    home: "Back home",
  },
} as const;

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang, setLang] = useState<"ru" | "en">("ru");

  useEffect(() => {
    setLang(document.documentElement.lang === "en" ? "en" : "ru");
  }, []);

  useEffect(() => {
    // digest связывает то, что видит пользователь, с записью в логах сервера.
    console.error("Render error:", error.digest ?? "", error);
  }, [error]);

  const t = copy[lang];

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6">
      <div className="text-center">
        <h1 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-fg-muted text-lg leading-relaxed">
          {t.text}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-medium text-base text-page transition-colors duration-300 hover:bg-accent-strong"
          >
            {t.retry}
          </button>
          <a
            href="/"
            className="font-medium text-accent text-base transition-colors duration-300 hover:text-accent-strong"
          >
            {t.home}
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-fg-dim text-xs">{error.digest}</p>
        )}
      </div>
    </main>
  );
}
