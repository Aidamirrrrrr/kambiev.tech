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

/**
 * Обрезает уже экранированный текст, не разрубая сущность пополам.
 * Обрыв на середине «&amp;» превратит остаток в мусор, а обрыв внутри тега
 * заставит Telegram отклонить всё сообщение.
 */
function truncateEscaped(value: string, limit: number) {
  if (value.length <= limit) return value;

  let cut = value.slice(0, limit - 1);
  const amp = cut.lastIndexOf("&");
  if (amp !== -1 && !cut.slice(amp).includes(";")) cut = cut.slice(0, amp);

  return `${cut}…`;
}

/** Поле шапки. Поля без значения не выводятся. */
export type NotificationField = [label: string, value: string | undefined];

/**
 * Собирает уведомление в едином виде: заголовок с источником, шапка из
 * подписанных полей и текст письма отдельной цитатой. Цитата нужна не для
 * красоты: она отделяет чужой текст от наших подписей, чтобы письмо не могло
 * притвориться служебной строкой.
 */
export function formatNotification({
  title,
  fields,
  body,
}: {
  title: string;
  fields: NotificationField[];
  body?: string;
}): string {
  const header = [
    `<b>${escapeHtml(title.toUpperCase())}</b>`,
    "",
    ...fields
      .filter(([, value]) => value?.trim())
      .map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value ?? "")}`),
  ].join("\n");

  if (!body?.trim()) return header;

  const open = "\n\n<blockquote expandable>";
  const close = "</blockquote>";
  const budget =
    MAX_MESSAGE_LENGTH - header.length - open.length - close.length;

  return (
    header + open + truncateEscaped(escapeHtml(body.trim()), budget) + close
  );
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
