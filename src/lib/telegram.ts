/** Общие помощники для работы с Telegram Bot API. */

const TELEGRAM_API = "https://api.telegram.org";

/** Предел длины текста одного сообщения в Telegram. */
export const MAX_MESSAGE_LENGTH = 4096;

/** Экранирует спецсимволы HTML для parse_mode: "HTML". */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Обрезает текст до предела, добавляя пометку об усечении. */
export function truncate(value: string, limit: number) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1)}…`;
}

/** Отправляет сообщение в чат. Бросает исключение, если Telegram ответил ошибкой. */
export async function sendMessage(
  token: string,
  chatId: string,
  text: string,
  options: { disablePreview?: boolean } = {},
) {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: truncate(text, MAX_MESSAGE_LENGTH),
      parse_mode: "HTML",
      disable_web_page_preview: options.disablePreview ?? true,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Telegram sendMessage failed: ${res.status} ${await res.text()}`,
    );
  }
}

/** Возвращает путь к файлу внутри хранилища Telegram по его file_id. */
export async function getFilePath(token: string, fileId: string) {
  const res = await fetch(
    `${TELEGRAM_API}/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`,
  );

  if (!res.ok) {
    throw new Error(`Telegram getFile failed: ${res.status}`);
  }

  const body = (await res.json()) as {
    ok: boolean;
    result?: { file_path?: string };
  };
  const filePath = body.result?.file_path;
  if (!body.ok || !filePath) {
    throw new Error("Telegram getFile returned no file_path");
  }

  return filePath;
}

/** Скачивает файл, ранее полученный через getFilePath. */
export async function downloadFile(token: string, filePath: string) {
  const res = await fetch(`${TELEGRAM_API}/file/bot${token}/${filePath}`);

  if (!res.ok) {
    throw new Error(`Telegram file download failed: ${res.status}`);
  }

  return Buffer.from(await res.arrayBuffer());
}
