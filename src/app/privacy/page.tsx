/**
 * Политика конфиденциальности.
 *
 * Форма обратной связи собирает персональные данные, поэтому политика нужна.
 * Текст описывает то, что происходит на самом деле: сообщение уходит
 * в Telegram оператора и нигде на сайте не сохраняется.
 *
 * Страница рендерится на сервере в языке из куки, поэтому попадает в индекс
 * поисковика текстом, а не пустым каркасом.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { pages } from "@/lib/dictionaries/pages";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Какие данные собирает форма обратной связи на ${site.domain}, зачем они нужны, куда уходят и как попросить их удалить.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("locale")?.value === "en" ? "en" : "ru";
  const t = pages[lang].privacy;

  return (
    <main className="bg-page">
      <article className="mx-auto max-w-3xl px-6 pt-14 pb-20 sm:pt-24 sm:pb-24">
        {/* «конфиденциальности» одним словом не влезает в 375px при 36px:
            на узком экране кегль меньше, hyphens страхует от переполнения. */}
        <h1 className="hyphens-auto font-semibold text-3xl text-fg tracking-tight sm:text-5xl">
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
