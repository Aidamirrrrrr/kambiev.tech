import { Webhook } from "svix";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetAlertThrottle } from "@/lib/alert";

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

/*
 * Пересылка письма и алерт о сбое уходят одним и тем же sendMessage,
 * поэтому разбираем вызовы по заголовку сообщения.
 */
function messagesWith(marker: string) {
  return sendMessage.mock.calls.filter((call) =>
    String(call[2]).includes(marker),
  );
}

const forwarded = () => messagesWith("ПИСЬМО НА ПОЧТУ");
const alerts = () => messagesWith("СБОЙ НА САЙТЕ");

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
    resetAlertThrottle();
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

      expect(forwarded()).toHaveLength(1);
      const text = String(forwarded()[0]?.[2]);
      expect(text).toContain("dev.aidamir@gmail.com");
      expect(text).toContain("Test");
      expect(text).toContain("Проверка связи");
    },
  );

  // Голые POST от сканеров ходят по любому публичному адресу: они не повод
  // для уведомления, иначе алерты быстро перестают читать.
  it("отклоняет запрос без заголовков подписи и молчит", async () => {
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
    expect(forwarded()).toHaveLength(0);
    // Заголовки пришли, значит это похоже на живую доставку, а не на скан.
    expect(alerts()).toHaveLength(1);
  });

  it("на посторонние события отвечает успехом и молчит", async () => {
    const payload = body("email.delivered");
    const res = await post(sign(payload, "webhook"), payload);

    expect(res.status).toBe(200);
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("просит повтор и предупреждает, если письмо не удалось забрать", async () => {
    getReceiving.mockResolvedValue({ data: null, error: { message: "нет" } });

    const payload = body();
    const res = await post(sign(payload, "webhook"), payload);

    expect(res.status).toBe(500);
    expect(forwarded()).toHaveLength(0);
    expect(String(alerts()[0]?.[2])).toContain(EMAIL_ID);
  });
});
