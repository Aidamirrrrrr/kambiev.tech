import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportFailure, resetAlertThrottle } from "./alert";

const sendMessage = vi.fn();

vi.mock("./telegram", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./telegram")>()),
  sendMessage: (...args: unknown[]) => sendMessage(...args),
}));

function sentText() {
  return String(sendMessage.mock.calls[0]?.[2]);
}

describe("reportFailure", () => {
  beforeEach(() => {
    resetAlertThrottle();
    vi.stubEnv("ALERT_BOT_TOKEN", "token");
    vi.stubEnv("ALERT_CHAT_ID", "1");
    sendMessage.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("шлёт место, текст ошибки и стек", async () => {
    await reportFailure("POST /api/contact", new Error("fetch failed"));

    const text = sentText();
    expect(text).toContain("<b>СБОЙ НА САЙТЕ</b>");
    expect(text).toContain("<b>Где:</b> POST /api/contact");
    expect(text).toContain("Error: fetch failed");
    expect(text).toContain("blockquote");
  });

  it("добавляет переданные поля", async () => {
    await reportFailure("POST /api/contact", new Error("сбой"), [
      ["Контакт", "@ivan"],
    ]);

    expect(sentText()).toContain("<b>Контакт:</b> @ivan");
  });

  it("переживает не-Error", async () => {
    await reportFailure("где-то", "просто строка");
    expect(sentText()).toContain("просто строка");
  });

  /*
   * Сбой внешнего сервиса приходит пачкой на каждый запрос. Без окна молчания
   * бот превращается в ленту одинаковых сообщений и алерты перестают читать.
   */
  it("не повторяет одинаковый алерт подряд", async () => {
    await reportFailure("POST /api/contact", new Error("fetch failed"));
    await reportFailure("POST /api/contact", new Error("fetch failed"));

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it("другой сбой в том же месте не глушится", async () => {
    await reportFailure("POST /api/contact", new Error("первый"));
    await reportFailure("POST /api/contact", new Error("второй"));

    expect(sendMessage).toHaveBeenCalledTimes(2);
  });

  it("молчит, когда бот не настроен", async () => {
    vi.stubEnv("ALERT_BOT_TOKEN", "");
    vi.stubEnv("ALERT_CHAT_ID", "");
    vi.stubEnv("MAIL_BOT_TOKEN", "");
    vi.stubEnv("MAIL_BOT_CHAT_ID", "");

    await reportFailure("где-то", new Error("сбой"));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  // Упавший алерт не должен подменять собой исходный сбой.
  it("не бросает, если Telegram недоступен", async () => {
    sendMessage.mockRejectedValue(new Error("Telegram лежит"));

    await expect(
      reportFailure("где-то", new Error("сбой")),
    ).resolves.toBeUndefined();
  });
});
