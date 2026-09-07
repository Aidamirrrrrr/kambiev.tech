/** Проверка и форматирование заявки. Вынесено из маршрута ради тестов. */

import { formatNotification } from "./telegram";

const LIMITS = { name: 100, contact: 200, message: 3000 } as const;
const MIN_CONTACT_LENGTH = 3;

export type Payload = {
  name: string;
  contact: string;
  message: string;
  locale: string;
};

/**
 * Тело приходит из сети, поэтому проверяем и типы, и содержимое.
 * Без проверки типа `trim()` на числе бросал исключение, и клиент получал
 * 500 вместо внятного 400.
 */
export function parsePayload(body: unknown): Payload | null {
  if (typeof body !== "object" || body === null) return null;

  const { name, contact, message, locale } = body as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    typeof contact !== "string" ||
    typeof message !== "string"
  ) {
    return null;
  }

  const trimmed = {
    name: name.trim(),
    contact: contact.trim(),
    message: message.trim(),
  };
  if (!trimmed.name || !trimmed.message) return null;
  if (trimmed.contact.length < MIN_CONTACT_LENGTH) return null;

  return {
    name: trimmed.name.slice(0, LIMITS.name),
    contact: trimmed.contact.slice(0, LIMITS.contact),
    message: trimmed.message.slice(0, LIMITS.message),
    locale: locale === "en" ? "en" : "ru",
  };
}

export function formatMessage({
  name,
  contact,
  message,
  locale,
}: Payload): string {
  const ru = locale === "ru";
  return formatNotification({
    title: ru ? "Заявка с сайта" : "Inquiry from the website",
    fields: [
      [ru ? "Имя" : "Name", name],
      [ru ? "Контакт" : "Contact", contact],
    ],
    body: message,
  });
}
