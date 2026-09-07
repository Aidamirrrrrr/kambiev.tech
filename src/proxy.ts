/**
 * Next.js proxy — определение локали по заголовку Accept-Language.
 * Устанавливает cookie `locale` при первом визите.
 */
import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["ru", "en"] as const;
const COOKIE_NAME = "locale";

/** Определяет язык и записывает в cookie. */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing && SUPPORTED_LOCALES.includes(existing as "ru" | "en")) {
    return response;
  }

  const acceptLang = request.headers.get("accept-language") || "";
  const detected = parseAcceptLanguage(acceptLang);

  response.cookies.set(COOKIE_NAME, detected, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

/** Парсит заголовок Accept-Language и возвращает подходящую локаль. */
function parseAcceptLanguage(header: string): "ru" | "en" {
  const languages = header
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("en")) return "en";
  }

  return "ru";
}

export const config = {
  matcher: ["/"],
};
