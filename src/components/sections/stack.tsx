"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Disclosure } from "@/components/disclosure";
import { LocaleTransition } from "@/components/locale-transition";
import { useI18n } from "@/lib/i18n";
import { type CategoryKey, type TechItem, techCategories } from "@/lib/stack";

const ease = [0.16, 1, 0.3, 1] as const;

/** Чип одной технологии. */
function TechChip({ item }: { item: TechItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-line bg-page px-4 py-2 text-base text-fg-muted transition-colors duration-300 hover:border-line-strong hover:text-fg"
    >
      {item.name}
    </a>
  );
}

/** Ряд одной категории стека. */
function CategoryRow({ items, label }: { items: TechItem[]; label: string }) {
  return (
    <div>
      <p className="font-medium text-fg-dim text-xs uppercase tracking-[0.12em]">
        <LocaleTransition className="inline">{label}</LocaleTransition>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <TechChip key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const categoryNames: Record<CategoryKey, string> = {
    frontend: t.stack.frontend,
    backend: t.stack.backend,
    tools: t.stack.tools,
    infra: t.stack.infra,
  };

  // На виду только основное. Полный список из четырёх категорий разворачивается
  // по клику: сорок с лишним названий подряд ничего не говорят читателю
  // не из разработки и занимали два экрана.
  const featured = techCategories.flatMap((c) =>
    c.items.filter((i) => i.featured),
  );

  return (
    <section id="stack" ref={sectionRef} className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <LocaleTransition>
            <h2 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
              {t.stack.title} {t.stack.titleAccent}
            </h2>
          </LocaleTransition>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {featured.map((item) => (
              <TechChip key={item.name} item={item} />
            ))}
          </div>

          <div className="mt-10">
            <Disclosure
              align="center"
              label={t.ui.showAll}
              labelOpen={t.ui.hideAll}
            >
              <div className="space-y-8 text-left">
                {techCategories.map((cat) => (
                  <CategoryRow
                    key={cat.key}
                    items={cat.items}
                    label={categoryNames[cat.key]}
                  />
                ))}
              </div>
            </Disclosure>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
