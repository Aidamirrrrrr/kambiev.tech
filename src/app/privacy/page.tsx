/**
 * Политика конфиденциальности.
 *
 * Форма обратной связи собирает персональные данные, поэтому политика нужна.
 * Текст описывает то, что происходит на самом деле: сообщение уходит
 * в Telegram оператора и нигде на сайте не сохраняется.
 *
 * Страница рендерится на сервере в языке из куки — так она попадёт в индекс
 * поисковика текстом, а не пустым каркасом.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Какие данные собирает форма обратной связи на ${site.domain}, зачем они нужны, куда уходят и как попросить их удалить.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

const EMAIL = site.email;
const UPDATED = "7 сентября 2026";

type Block = { h: string; p: string[] };

const ru = {
  title: "Политика конфиденциальности",
  intro: `Сайт ${site.domain}, личное портфолио. Персональные данные собираются здесь только через форму обратной связи и только те, которые вы вписали сами. Обновлено ${UPDATED}.`,
  back: "На главную",
  blocks: [
    {
      h: "Кто обрабатывает данные",
      p: [
        `Камбиев Айдамир, разработчик и владелец сайта. Связаться можно письмом на ${EMAIL}.`,
      ],
    },
    {
      h: "Какие данные собираются",
      p: [
        "Только содержимое формы обратной связи: имя, способ связи (почта или ник в Telegram) и текст сообщения. Ничего из этого не является обязательным для просмотра сайта.",
        "Сайт не использует аналитику, рекламные пиксели и сторонние трекеры. Единственная кука, locale, хранит выбранный язык интерфейса и не идентифицирует вас.",
      ],
    },
    {
      h: "Зачем они нужны",
      p: [
        "Единственная цель: ответить на ваше обращение. Данные не используются для рассылок и не передаются третьим лицам для маркетинга.",
      ],
    },
    {
      h: "Куда они уходят",
      p: [
        "Сообщение из формы пересылается в личный чат владельца сайта через Telegram Bot API и остаётся в этой переписке. В базе данных сайта оно не сохраняется.",
        "Это значит, что доставку сообщения технически обеспечивает Telegram, и на этом этапе действуют его собственные правила обработки данных.",
      ],
    },
    {
      h: "Сколько они хранятся",
      p: [
        "Сообщение хранится в переписке Telegram до тех пор, пока владелец сайта не удалит его вручную. Отдельного архива обращений не ведётся.",
      ],
    },
    {
      h: "Ваши права",
      p: [
        `Вы можете попросить удалить своё обращение или узнать, что именно было получено. Напишите на ${EMAIL}, и запрос будет выполнен.`,
      ],
    },
  ] as Block[],
};

const en = {
  title: "Privacy policy",
  intro: `${site.domain} is a personal portfolio. Personal data is collected here only through the contact form, and only what you typed in yourself. Updated 7 September 2026.`,
  back: "Back home",
  blocks: [
    {
      h: "Who processes the data",
      p: [
        `Aidamir Kambiev, the developer and owner of this site. You can reach me at ${EMAIL}.`,
      ],
    },
    {
      h: "What is collected",
      p: [
        "Only the contents of the contact form: your name, a way to reach you (email or Telegram handle) and your message. None of it is required to browse the site.",
        "The site uses no analytics, advertising pixels or third-party trackers. The single cookie, locale, stores your chosen interface language and does not identify you.",
      ],
    },
    {
      h: "Why it is needed",
      p: [
        "The only purpose is to reply to you. The data is not used for mailings and is not shared with third parties for marketing.",
      ],
    },
    {
      h: "Where it goes",
      p: [
        "Your message is forwarded to the site owner's private chat through the Telegram Bot API and stays in that conversation. It is not stored in any site database.",
        "This means delivery is technically handled by Telegram, and at that step Telegram's own data practices apply.",
      ],
    },
    {
      h: "How long it is kept",
      p: [
        "The message stays in the Telegram conversation until the site owner deletes it manually. No separate archive of enquiries is kept.",
      ],
    },
    {
      h: "Your rights",
      p: [
        `You can ask for your enquiry to be deleted, or ask what exactly was received. Write to ${EMAIL} and the request will be carried out.`,
      ],
    },
  ] as Block[],
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const t = cookieStore.get("locale")?.value === "en" ? en : ru;

  return (
    <main className="bg-page">
      <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <h1 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-6 text-fg-muted text-lg leading-relaxed">{t.intro}</p>

        <div className="mt-14 space-y-12">
          {t.blocks.map((block) => (
            <section key={block.h}>
              <h2 className="font-semibold text-fg text-xl tracking-tight">
                {block.h}
              </h2>
              {block.p.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-base text-fg-muted leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <a
          href="/"
          className="mt-16 inline-flex items-center gap-1 font-medium text-accent text-base transition-colors hover:text-accent-strong"
        >
          <span aria-hidden>&lsaquo;</span>
          {t.back}
        </a>
      </article>
    </main>
  );
}
