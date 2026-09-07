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
