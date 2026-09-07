/**
 * Приём входящей почты от Resend и пересылка её в Telegram.
 *
 * Resend шлёт только метаданные письма, поэтому тело и заголовки
 * забираются отдельным запросом к Receiving API по email_id.
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Webhook } from "svix";
import { htmlToText } from "@/lib/email";
import { escapeHtml, sendMessage, truncate } from "@/lib/telegram";

/** Сколько символов тела письма помещаем в сообщение, оставляя место под шапку. */
const MAX_BODY = 3000;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const token = process.env.MAIL_BOT_TOKEN;
  const chatId = process.env.MAIL_BOT_CHAT_ID;

  if (!secret || !apiKey || !token || !chatId) {
    console.error(
      "Inbound email: не заданы RESEND_WEBHOOK_SECRET / RESEND_API_KEY / MAIL_BOT_TOKEN / MAIL_BOT_CHAT_ID",
    );
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Подпись считается по сырому телу: пересобранный JSON её не пройдёт.
  const payload = await request.text();

  /*
   * Заголовки отдаём целиком. Resend подписывает по спецификации Standard
   * Webhooks и шлёт webhook-id / webhook-timestamp / webhook-signature, тогда
   * как исторический префикс у Svix свой: svix-id и далее. Библиотека умеет
   * оба, но выбирает через ??, поэтому подстановка пустой строки вместо
   * отсутствующего svix-id глушила запасной вариант и запрос падал с
   * Missing required headers. Ключи Headers уже в нижнем регистре.
   */
  const headers = Object.fromEntries(request.headers);

  let event: { type?: string; data?: { email_id?: string } };
  try {
    // verify ничего не возвращает, только бросает исключение при расхождении,
    // поэтому событие разбираем сами из уже доверенного тела.
    new Webhook(secret).verify(payload, headers);
    event = JSON.parse(payload);
  } catch (error) {
    const signatureHeaders = Object.keys(headers).filter((name) =>
      /^(svix|webhook)-/.test(name),
    );
    console.error(
      `Inbound email: подпись вебхука не прошла проверку, заголовки подписи: ${
        signatureHeaders.join(", ") || "отсутствуют"
      }`,
      error,
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Остальные события Resend нас не интересуют, но отвечаем успехом,
  // чтобы он не копил повторные доставки.
  if (event.type !== "email.received" || !event.data?.email_id) {
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { data: email, error } = await resend.emails.receiving.get(
      event.data.email_id,
    );

    if (error || !email) {
      throw new Error(`Receiving API: ${error?.message ?? "empty response"}`);
    }

    const body =
      email.text?.trim() || (email.html ? htmlToText(email.html) : "");

    const lines = [
      "📬 <b>Новое письмо</b>",
      "",
      `<b>От:</b> ${escapeHtml(email.from)}`,
      `<b>Кому:</b> ${escapeHtml(email.received_for.join(", ") || email.to.join(", "))}`,
      `<b>Тема:</b> ${escapeHtml(email.subject || "(без темы)")}`,
    ];

    if (email.attachments.length > 0) {
      const names = email.attachments
        .map((a) => `${a.filename ?? "файл"} (${Math.round(a.size / 1024)} КБ)`)
        .join(", ");
      lines.push(`<b>Вложения:</b> ${escapeHtml(names)}`);
    }

    lines.push("", escapeHtml(truncate(body || "(пустое письмо)", MAX_BODY)));

    await sendMessage(token, chatId, lines.join("\n"));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inbound email: не удалось переслать письмо", error);
    // 500 заставит Resend повторить доставку позже.
    return NextResponse.json({ error: "Forwarding failed" }, { status: 500 });
  }
}
