import { Webhook } from "svix";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Секрет Standard Webhooks: префикс whsec_ и дальше base64. Значение
 * произвольное, важно лишь чтобы им можно было и подписать, и проверить.
 */
const SECRET = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
const EMAIL_ID = "56761188-7520-42d8-8898-ff6fc54ce618";

const RECEIVED = {
  from: "dev.aidamir@gmail.com",
  to: ["hello@kambiev.tech"],
  received_for: ["hello@kambiev.tech"],
  subject: "Test",
  text: "Проверка связи",
  html: null,
  attachments: [],
};

const sendMessage = vi.fn();
const getReceiving = vi.fn();

vi.mock("@/lib/telegram", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/telegram")>()),
  sendMessage: (...args: unknown[]) => sendMessage(...args),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { receiving: { get: (id: string) => getReceiving(id) } };
  },
}));

function body(type = "email.received") {
  return JSON.stringify({ type, data: { email_id: EMAIL_ID } });
}

/** Подписывает тело так же, как это делает Resend. */
function sign(payload: string, prefix: "svix" | "webhook") {
  const id = "msg_p5jXN8AQM9LWM0D4loKWxJek";
  const timestamp = new Date();

  return {
    [`${prefix}-id`]: id,
    [`${prefix}-timestamp`]: String(Math.floor(timestamp.getTime() / 1000)),
    [`${prefix}-signature`]: new Webhook(SECRET).sign(id, timestamp, payload),
  };
}

async function post(headers: Record<string, string>, payload = body()) {
  const { POST } = await import("./route");
  return POST(
    new Request("https://kambiev.tech/api/inbound-email", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: payload,
    }),
  );
}

describe("POST /api/inbound-email", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_WEBHOOK_SECRET", SECRET);
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("MAIL_BOT_TOKEN", "test-token");
    vi.stubEnv("MAIL_BOT_CHAT_ID", "1");
    vi.spyOn(console, "error").mockImplementation(() => {});
    getReceiving.mockResolvedValue({ data: RECEIVED, error: null });
    sendMessage.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  /*
   * Resend подписывает по спецификации Standard Webhooks и шлёт webhook-*.
   * Раньше обработчик забирал только svix-*, подставляя пустую строку вместо
   * отсутствующих, и это глушило запасной вариант внутри библиотеки: все
   * письма молча терялись с Missing required headers.
   */
  it.each(["webhook", "svix"] as const)(
    "пересылает письмо в Telegram при подписи с заголовками %s-*",
    async (prefix) => {
      const payload = body();
      const res = await post(sign(payload, prefix), payload);

      expect(res.status).toBe(200);
      expect(getReceiving).toHaveBeenCalledWith(EMAIL_ID);

      expect(sendMessage).toHaveBeenCalledTimes(1);
      const text = String(sendMessage.mock.calls[0]?.[2]);
      expect(text).toContain("dev.aidamir@gmail.com");
      expect(text).toContain("Test");
      expect(text).toContain("Проверка связи");
    },
  );

  it("отклоняет запрос без заголовков подписи", async () => {
    const res = await post({});
    expect(res.status).toBe(401);
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("отклоняет подпись, сделанную чужим секретом", async () => {
    const payload = body();
    const headers = sign(payload, "webhook");
    headers["webhook-signature"] = "v1,ZG9uZQ==";

    const res = await post(headers, payload);
    expect(res.status).toBe(401);
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("на посторонние события отвечает успехом и молчит", async () => {
    const payload = body("email.delivered");
    const res = await post(sign(payload, "webhook"), payload);

    expect(res.status).toBe(200);
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("просит повтор, если письмо не удалось забрать", async () => {
    getReceiving.mockResolvedValue({ data: null, error: { message: "нет" } });

    const payload = body();
    const res = await post(sign(payload, "webhook"), payload);

    expect(res.status).toBe(500);
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
