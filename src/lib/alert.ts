import {
  formatNotification,
  type NotificationField,
  sendMessage,
} from "./telegram";

/** Сколько ждать, прежде чем повторить алерт с тем же ключом. */
const COOLDOWN_MS = 10 * 60 * 1000;

/** Сколько символов стека кладём в сообщение. */
const MAX_STACK = 1200;

const lastSent = new Map<string, number>();

function describe(error: unknown) {
  if (error instanceof Error) {
    return {
      title: `${error.name}: ${error.message}`,
      stack: error.stack ?? "",
    };
  }
  return { title: String(error), stack: "" };
}

/**
 * Ставит алерт в тишину, если такой же уже улетал недавно. Сбой внешнего
 * сервиса приходит пачкой на каждый запрос, и без этого бот превращается
 * в ленту одинаковых сообщений.
 */
function shouldSend(key: string, now: number) {
  const previous = lastSent.get(key);
  if (previous !== undefined && now - previous < COOLDOWN_MS) return false;

  lastSent.set(key, now);
  return true;
}

/**
 * Сообщает о сбое в Telegram. Ничего не бросает и не возвращает ошибок:
 * упавший алерт не должен подменять собой исходный сбой.
 */
export async function reportFailure(
  where: string,
  error: unknown,
  details: NotificationField[] = [],
) {
  const token = process.env.ALERT_BOT_TOKEN ?? process.env.MAIL_BOT_TOKEN;
  const chatId = process.env.ALERT_CHAT_ID ?? process.env.MAIL_BOT_CHAT_ID;
  if (!token || !chatId) return;

  const { title, stack } = describe(error);
  if (!shouldSend(`${where}|${title}`, Date.now())) return;

  try {
    await sendMessage(
      token,
      chatId,
      formatNotification({
        title: "Сбой на сайте",
        fields: [
          ["Где", where],
          ["Что", title],
          ["Когда", new Date().toISOString()],
          ...details,
        ],
        body: stack.slice(0, MAX_STACK),
      }),
    );
  } catch {
    // Telegram сам может быть причиной сбоя, о котором мы сообщаем.
  }
}

/** Только для тестов: сбрасывает окно молчания. */
export function resetAlertThrottle() {
  lastSent.clear();
}
