import { NextResponse } from "next/server";
import { reportFailure } from "@/lib/alert";
import { formatMessage, type Payload, parsePayload } from "@/lib/contact";
import { sendMessage } from "@/lib/telegram";

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
    await reportFailure(
      "POST /api/contact",
      new Error("TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы"),
    );
    return NextResponse.json(
      { error: "Messaging is not configured" },
      { status: 500 },
    );
  }

  try {
    await sendMessage(token, chatId, formatMessage(payload));
  } catch (error) {
    console.error("Contact form: не удалось отправить сообщение", error);
    /*
     * Заявка уже потеряна для основного бота, поэтому в алерт кладём контакт
     * автора: по нему можно ответить руками, не дожидаясь починки.
     */
    await reportFailure("POST /api/contact", error, [
      ["Заявка от", payload.name],
      ["Контакт", payload.contact],
    ]);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
