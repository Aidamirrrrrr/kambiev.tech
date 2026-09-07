/** Определение языка по Accept-Language при первом визите. */
import { type NextRequest, NextResponse } from "next/server";
import { isLocale, parseAcceptLanguage } from "@/lib/locale";

const COOKIE_NAME = "locale";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (isLocale(existing)) {
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
