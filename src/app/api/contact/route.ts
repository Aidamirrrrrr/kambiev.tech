/** API-маршрут отправки заявки в Telegram через Bot API. */

import { NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";
const MAX_NAME = 100;
const MAX_CONTACT = 200;
const MAX_MESSAGE = 3000;

/** Экранирует спецсимволы HTML для parse_mode: "HTML". */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const { name, contact, message, locale } = await request.json();
    const isRu = locale === "ru";

    if (!name?.trim() || !contact?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (contact.trim().length < 3) {
      return NextResponse.json({ error: "Invalid contact" }, { status: 400 });
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

    const text = [
      `<b>${isRu ? "Новая заявка с сайта" : "New inquiry from the website"}</b>`,
      "",
      `<b>${isRu ? "Имя" : "Name"}:</b> ${escapeHtml(name.trim().slice(0, MAX_NAME))}`,
      `<b>${isRu ? "Контакт" : "Contact"}:</b> ${escapeHtml(contact.trim().slice(0, MAX_CONTACT))}`,
      "",
      `<b>${isRu ? "Сообщение" : "Message"}:</b>`,
      escapeHtml(message.trim().slice(0, MAX_MESSAGE)),
    ].join("\n");

    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const details = await res.text();
      console.error("Telegram sendMessage failed:", res.status, details);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
