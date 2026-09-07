/**
 * Тексты отдельных страниц: политика, 404 и граница ошибок.
 *
 * Держатся отдельно от основного словаря намеренно. Основной импортируется
 * провайдером и целиком уезжает в клиентский бандл главной страницы, а этот
 * нужен только своим страницам, и складывать его туда же значит возить
 * с каждой загрузкой текст, который почти никто не увидит.
 */

import { site } from "@/lib/site";

/** Дата последнего пересмотра политики. Правится вручную вместе с текстом. */
const UPDATED = { ru: "7 сентября 2026", en: "7 September 2026" } as const;

const EMAIL = site.email;

export type PolicyBlock = { h: string; p: string[] };

export type PageCopy = {
  privacy: {
    title: string;
    intro: string;
    back: string;
    blocks: PolicyBlock[];
  };
  notFound: { code: string; title: string; text: string; back: string };
  error: { title: string; text: string; retry: string; home: string };
};

export const pages: Record<"ru" | "en", PageCopy> = {
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      intro: `Сайт ${site.domain}, личное портфолио. Персональные данные собираются здесь только через форму обратной связи и только те, которые вы вписали сами. Обновлено ${UPDATED.ru}.`,
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
      ],
    },
    notFound: {
      code: "404",
      title: "Такой страницы нет",
      text: "Возможно, адрес набран с опечаткой или страница переехала.",
      back: "На главную",
    },
    error: {
      title: "Что-то сломалось",
      text: "Страница не отрисовалась. Можно попробовать ещё раз или вернуться на главную.",
      retry: "Попробовать снова",
      home: "На главную",
    },
  },
  en: {
    privacy: {
      title: "Privacy policy",
      intro: `${site.domain} is a personal portfolio. Personal data is collected here only through the contact form, and only what you typed in yourself. Updated ${UPDATED.en}.`,
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
      ],
    },
    notFound: {
      code: "404",
      title: "This page does not exist",
      text: "The address may have a typo, or the page has moved.",
      back: "Back home",
    },
    error: {
      title: "Something broke",
      text: "The page failed to render. Try again, or go back to the homepage.",
      retry: "Try again",
      home: "Back home",
    },
  },
};
