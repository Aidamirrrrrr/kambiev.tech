/**
 * Поле одно, а вариантов три: почта, ник в Telegram или телефон. Жёсткая маска
 * тут мешала бы, поэтому вид определяется по набранному, а маска применяется
 * только к телефону.
 */

export type ContactKind = "email" | "telegram" | "phone" | "unknown";

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const TELEGRAM = /^@[a-z0-9_]{5,32}$/i;
const TELEGRAM_LINK = /^(?:https?:\/\/)?t\.me\/([a-z0-9_]{5,32})$/i;

/** Порядок проверок важен: «@ivan» это ник, а не почта. */
export function detectContactKind(raw: string): ContactKind {
  const value = raw.trim();
  if (!value) return "unknown";

  if (value.startsWith("@") || TELEGRAM_LINK.test(value)) return "telegram";
  if (value.includes("@")) return "email";

  const digits = value.replace(/\D/g, "");
  if (digits.length >= 5 && /^[+\d][\d\s()\-+]*$/.test(value)) return "phone";

  return "unknown";
}

/** Сколько цифр максимум может быть в номере по E.164. */
const MAX_DIGITS = 15;
/** Столько цифр в российском номере вместе с кодом страны. */
const RU_DIGITS = 11;

/**
 * Номер записан с чужим кодом страны: явный плюс и за ним не семёрка.
 * Без плюса считаем номер российским, потому что местные обычно набирают
 * его без кода страны вовсе.
 */
function isForeign(raw: string): boolean {
  const value = raw.trim();
  if (!value.startsWith("+")) return false;

  const digits = value.replace(/\D/g, "");
  return digits.length > 0 && digits[0] !== "7";
}

/** Набранное не из цифр возвращается как есть: маска не мешает почте и нику. */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw.trimStart() === "+" ? "+" : "";

  /*
   * Чужой код страны оставляем как есть, вместе с авторской разбивкой на
   * группы: правила группировки у каждой страны свои. Раньше сюда безусловно
   * подставлялась семёрка, и «+49 151 2345678» превращался в
   * «+7 (491) 512-34-56», то есть в чужой российский номер, который вдобавок
   * проходил проверку.
   */
  if (isForeign(raw)) return raw;

  // 8 в начале и 7 равнозначны, храним в одном виде
  if (digits[0] === "8") digits = `7${digits.slice(1)}`;
  if (digits[0] !== "7") digits = `7${digits}`;
  digits = digits.slice(0, RU_DIGITS);

  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

export function isContactValid(raw: string): boolean {
  const value = raw.trim();
  switch (detectContactKind(value)) {
    case "email":
      return EMAIL.test(value);
    case "telegram":
      return TELEGRAM.test(value) || TELEGRAM_LINK.test(value);
    case "phone": {
      const digits = value.replace(/\D/g, "").length;
      // У чужих стран длина своя, поэтому проверяем только границы E.164.
      return isForeign(value)
        ? digits >= 8 && digits <= MAX_DIGITS
        : digits === RU_DIGITS;
    }
    default:
      return false;
  }
}
