"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LocaleTransition } from "@/components/locale-transition";
import { Action, Actions } from "@/components/ui/action";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";

export function CtaBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });
  const { t } = useI18n();

  return (
    <section ref={sectionRef} className="bg-page py-24 text-center sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-4xl px-6"
      >
        <LocaleTransition>
          <h2 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
            {t.ctaBanner.title} {t.ctaBanner.titleAccent}
          </h2>
        </LocaleTransition>

        <LocaleTransition>
          <p className="mx-auto mt-6 max-w-3xl text-fg-muted text-xl leading-relaxed">
            {t.ctaBanner.text}
          </p>
        </LocaleTransition>

        <div className="mt-10">
          <Actions>
            <Action href="#contact">{t.ctaBanner.cta}</Action>
            <Action href={site.telegram} variant="outline" external>
              {t.ctaBanner.ctaTelegram}
            </Action>
          </Actions>
        </div>

        {/*
          Раньше тут стояли три крупные цифры, первой из которых было обещание
          ответить за сутки. Без него осталось два факта, и ряд статистики под
          них уже не нужен: тихая строка, как в хиро, честнее по весу.
        */}
        <p className="mt-12 text-fg-dim text-sm">
          <LocaleTransition className="inline">
            {t.ctaBanner.meta}
          </LocaleTransition>
        </p>
      </motion.div>
    </section>
  );
}
