"use client";

/** Главный экран: имя, одна понятная фраза о работе, действие и витрина работ. */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/device-frame";
import { LocaleTransition } from "@/components/locale-transition";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);

  // Витрина на первом экране: телефоны уходят вниз медленнее центрального окна,
  // из-за чего связка читается объёмной, а не плоской картинкой.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const centerY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const sideY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const lineupOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0.4]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden px-6 pt-28 pb-20"
    >
      <div className="mx-auto w-full max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-medium text-accent text-base sm:text-lg"
        >
          <LocaleTransition className="inline">{t.hero.label}</LocaleTransition>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="mt-3 font-semibold text-[clamp(2.75rem,7vw,5.5rem)] text-fg leading-[1.05] tracking-tight"
        >
          <LocaleTransition>
            {t.hero.line1} {t.hero.line2}
          </LocaleTransition>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mx-auto mt-6 max-w-2xl text-fg-muted text-xl leading-snug sm:text-2xl"
        >
          <LocaleTransition>{t.hero.tagline}</LocaleTransition>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-10 flex items-center justify-center"
        >
          <a
            href="#work"
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-medium text-base text-page transition-colors duration-300 hover:bg-accent-strong"
          >
            <LocaleTransition className="inline">{t.hero.cta}</LocaleTransition>
          </a>
        </motion.div>

        {/* Где я сейчас: рекрутер ищет это первым, поэтому строка есть, но тихая. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 text-fg-dim text-sm"
        >
          <LocaleTransition className="inline">{t.hero.now}</LocaleTransition>
          <span aria-hidden className="mx-2">
            ·
          </span>
          <LocaleTransition className="inline">{t.hero.place}</LocaleTransition>
        </motion.p>
      </div>

      {/*
        Витрина работ прямо на первом экране: без неё хиро остаётся текстом
        в пустоте. Телефоны по бокам показываются с планшета, чтобы на узком
        экране не мельчить.

        Анимации появления здесь намеренно нет. Центральный кадр это
        LCP-элемент страницы, и пока он стартовал с нулевой прозрачностью
        и ждал задержки в 0.85с, задержка отрисовки на мобильном профиле
        доходила до 3.1с при том, что картинка весит 40 КБ и грузится
        мгновенно. Осталась только прозрачность от скролла, стартующая
        с единицы.
      */}
      <div className="mx-auto mt-16 w-full max-w-6xl">
        <motion.div
          style={{ opacity: lineupOpacity }}
          className="flex w-full items-end justify-center gap-6 lg:gap-10"
        >
          <motion.div
            style={{ y: sideY }}
            className="hidden w-[15%] max-w-[200px] shrink-0 md:block"
          >
            <PhoneFrame
              src="/work/velizhanin.webp"
              alt="VELIZHANIN: приложение для авторов Telegram-каналов"
              sizes="180px"
            />
          </motion.div>

          <motion.div
            style={{ y: centerY }}
            className="w-full min-w-0 max-w-3xl"
          >
            <BrowserFrame
              src="/work/flowai.webp"
              alt="FlowAi: сайт AI-платформы"
              host="flowai.ru"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </motion.div>

          <motion.div
            style={{ y: sideY }}
            className="hidden w-[15%] max-w-[200px] shrink-0 md:block"
          >
            <PhoneFrame
              src="/work/element-mini.webp"
              alt="ELEMENT Concept: магазин букетов в Telegram"
              sizes="180px"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
