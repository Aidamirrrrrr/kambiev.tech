/** Приём заявки с формы и пересылка её в Telegram. */

import { NextResponse } from "next/server";
import { escapeHtml, sendMessage } from "@/lib/telegram";

const LIMITS = { name: 100, contact: 200, message: 3000 } as const;
const MIN_CONTACT_LENGTH = 3;

type Payload = {
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
function parsePayload(body: unknown): Payload | null {
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

function format({ name, contact, message, locale }: Payload): string {
  const ru = locale === "ru";
  return [
    `<b>${ru ? "Новая заявка с сайта" : "New inquiry from the website"}</b>`,
    "",
    `<b>${ru ? "Имя" : "Name"}:</b> ${escapeHtml(name)}`,
    `<b>${ru ? "Контакт" : "Contact"}:</b> ${escapeHtml(contact)}`,
    "",
    `<b>${ru ? "Сообщение" : "Message"}:</b>`,
    escapeHtml(message),
  ].join("\n");
}

export async function POST(request: Request) {
  let payload: Payload | null;
  try {
    payload = parsePayload(await request.json());
  } catch {
    // Тело оказалось не JSON: это ошибка запроса, а не сбой сервера.
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error(
      "Contact form: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы",
    );
    return NextResponse.json(
      { error: "Messaging is not configured" },
      { status: 500 },
    );
  }

  try {
    await sendMessage(token, chatId, format(payload));
  } catch (error) {
    console.error("Contact form: не удалось отправить сообщение", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
