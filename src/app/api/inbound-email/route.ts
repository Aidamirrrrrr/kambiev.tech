/** Resend шлёт только метаданные, поэтому тело забирается отдельным запросом. */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Webhook } from "svix";
import { reportFailure } from "@/lib/alert";
import { htmlToText } from "@/lib/email";
import { formatNotification, sendMessage, truncate } from "@/lib/telegram";

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
   * Заголовки отдаём целиком. Resend шлёт webhook-id и далее по спецификации
   * Standard Webhooks, у Svix исторический префикс свой: svix-id. Библиотека
   * знает оба, но выбирает через ??, поэтому пустая строка вместо
   * отсутствующего svix-id глушит запасной вариант.
   */
  const headers = Object.fromEntries(request.headers);

  let event: { type?: string; data?: { email_id?: string } };
  try {
    // verify ничего не возвращает, только бросает исключение при расхождении.
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

    /*
     * Алерт только если заголовки подписи вообще пришли: это похоже на живую
     * доставку от Resend, которая не сошлась. Голые POST от сканеров ходят
     * по любому публичному адресу и в уведомления попадать не должны.
     */
    if (signatureHeaders.length > 0) {
      await reportFailure("POST /api/inbound-email", error, [
        ["Заголовки подписи", signatureHeaders.join(", ")],
      ]);
    }

    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // На остальные события отвечаем успехом, иначе Resend копит повторы.
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

    const attachments = email.attachments
      .map((a) => `${a.filename ?? "файл"}, ${Math.round(a.size / 1024)} КБ`)
      .join(" · ");

    const text = formatNotification({
      title: "Письмо на почту",
      fields: [
        ["Кому", email.received_for.join(", ") || email.to.join(", ")],
        ["От", email.from],
        ["Тема", email.subject || "без темы"],
        ["Вложения", attachments || undefined],
      ],
      body: truncate(body, MAX_BODY) || "Письмо без текста.",
    });

    await sendMessage(token, chatId, text);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inbound email: не удалось переслать письмо", error);
    await reportFailure("POST /api/inbound-email", error, [
      ["Письмо", event.data.email_id],
    ]);
    // 500 заставит Resend повторить доставку позже.
    return NextResponse.json({ error: "Forwarding failed" }, { status: 500 });
  }
}
