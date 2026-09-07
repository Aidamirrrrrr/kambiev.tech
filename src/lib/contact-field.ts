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

/** Набранное не из цифр возвращается как есть: маска не мешает почте и нику. */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw.trimStart() === "+" ? "+" : "";

  // 8 в начале и 7 равнозначны, храним в одном виде
  if (digits[0] === "8") digits = `7${digits.slice(1)}`;
  if (digits[0] !== "7") digits = `7${digits}`;
  digits = digits.slice(0, 11);

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
    case "phone":
      return value.replace(/\D/g, "").length === 11;
    default:
      return false;
  }
}
