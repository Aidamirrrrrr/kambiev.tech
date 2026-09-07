/** Страница 404. Без неё Next отдаёт свою служебную, без стилей и пути назад. */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

const copy = {
  ru: {
    code: "404",
    title: "Такой страницы нет",
    text: "Возможно, адрес набран с опечаткой или страница переехала.",
    back: "На главную",
  },
  en: {
    code: "404",
    title: "This page does not exist",
    text: "The address may have a typo, or the page has moved.",
    back: "Back home",
  },
} as const;

export default async function NotFound() {
  const cookieStore = await cookies();
  const t = cookieStore.get("locale")?.value === "en" ? copy.en : copy.ru;

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6">
      <div className="text-center">
        <p className="font-semibold text-accent text-base">{t.code}</p>
        <h1 className="mt-3 font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-fg-muted text-lg leading-relaxed">
          {t.text}
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-medium text-base text-page transition-colors duration-300 hover:bg-accent-strong"
        >
          {t.back}
        </Link>
      </div>
    </main>
  );
}
