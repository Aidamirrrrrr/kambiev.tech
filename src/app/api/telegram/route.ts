/**
 * Вебхук Telegram-бота «Kambiev Mail».
 *
 * Единственное действие, меняющее состояние, — подмена резюме на сайте:
 * владелец присылает боту PDF, файл ложится на том, откуда его отдаёт
 * /api/resume. Пересборка образа не нужна.
 *
 * Доступ ограничен дважды: секретом в заголовке, который знает только
 * Telegram, и сверкой отправителя с владельцем бота.
 */

import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { absoluteUrl, site } from "@/lib/site";
import { downloadFile, getFilePath, sendMessage } from "@/lib/telegram";

/** Куда кладём резюме; тот же путь читает /api/resume. */
const RESUME_PATH =
  process.env.RESUME_PATH ?? path.join(process.cwd(), "data", "resume.pdf");

/** Резюме заведомо меньше; ограничение отсекает случайные тяжёлые файлы. */
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

interface TelegramUpdate {
  message?: {
    chat?: { id?: number };
    from?: { id?: number };
    text?: string;
    document?: {
      file_id?: string;
      file_name?: string;
      mime_type?: string;
      file_size?: number;
    };
  };
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const token = process.env.MAIL_BOT_TOKEN;
  const ownerId = process.env.MAIL_BOT_CHAT_ID;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !ownerId || !webhookSecret) {
    console.error(
      "Telegram webhook: не заданы MAIL_BOT_TOKEN / MAIL_BOT_CHAT_ID / TELEGRAM_WEBHOOK_SECRET",
    );
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Секрет знает только Telegram — он приходит в каждом запросе вебхука.
  if (
    request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  const senderId = message?.from?.id ?? message?.chat?.id;

  // Бота может найти кто угодно; менять резюме вправе только владелец.
  if (!senderId || String(senderId) !== ownerId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const document = message?.document;

    if (document?.file_id) {
      const isPdf =
        document.mime_type === "application/pdf" ||
        document.file_name?.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        await sendMessage(token, ownerId, "Нужен файл PDF, этот не подошёл.");
        return NextResponse.json({ ok: true });
      }

      if ((document.file_size ?? 0) > MAX_RESUME_BYTES) {
        await sendMessage(token, ownerId, "Файл больше 10 МБ, не принимаю.");
        return NextResponse.json({ ok: true });
      }

      const filePath = await getFilePath(token, document.file_id);
      const file = await downloadFile(token, filePath);

      if (!file.subarray(0, 5).toString("latin1").startsWith("%PDF-")) {
        await sendMessage(token, ownerId, "Это не похоже на PDF внутри.");
        return NextResponse.json({ ok: true });
      }

      // Пишем через временный файл, чтобы сайт не отдал половину резюме,
      // если запись оборвётся.
      const tmpPath = `${RESUME_PATH}.tmp`;
      await writeFile(tmpPath, file);
      await rename(tmpPath, RESUME_PATH);

      const size = Math.round(file.byteLength / 1024);
      await sendMessage(
        token,
        ownerId,
        `Резюме обновлено (${size} КБ).\nПроверить: ${absoluteUrl("/resume.pdf")}`,
      );

      return NextResponse.json({ ok: true });
    }

    if (message?.text) {
      await sendMessage(
        token,
        ownerId,
        [
          "<b>Kambiev Mail</b>",
          "",
          `Сюда приходят письма с ${site.email}.`,
          "Пришлите PDF-файл, он станет резюме на сайте.",
        ].join("\n"),
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook: ошибка обработки апдейта", error);
    return NextResponse.json({ ok: true });
  }
}
