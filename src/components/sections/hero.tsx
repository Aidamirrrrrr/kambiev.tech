"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/device-frame";
import { LocaleTransition } from "@/components/locale-transition";
import { Action, Actions } from "@/components/ui/action";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);

  /*
   * Витрина разъезжается по глубине: центральное окно уходит вверх и слегка
   * наезжает на зрителя, телефоны отстают и расходятся в стороны. Три слоя
   * с разной скоростью читаются объёмом, а не сдвинутой картинкой.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const centerY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const sideY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const sideScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const leftX = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const lineupOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0.25]);

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
          className="mt-10"
        >
          <Actions>
            <Action href="#contact">{t.hero.ctaPrimary}</Action>
            <Action href="#work" variant="outline">
              {t.hero.cta}
            </Action>
          </Actions>
        </motion.div>

        {/* Рекрутер ищет это первым, поэтому строка есть, но тихая. */}
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
        Анимации появления здесь намеренно нет: центральный кадр это
        LCP-элемент, и стартовая прозрачность с задержкой доводила render
        delay на мобильном профиле до 3.1с. Движение только от скролла.
      */}
      <div className="mx-auto mt-16 w-full max-w-6xl">
        <motion.div
          style={{ opacity: lineupOpacity }}
          className="flex w-full items-end justify-center gap-6 lg:gap-10"
        >
          <motion.div
            style={{ y: sideY, x: leftX, scale: sideScale }}
            className="hidden w-[15%] max-w-[200px] shrink-0 md:block"
          >
            <PhoneFrame
              src="/work/velizhanin.webp"
              alt="VELIZHANIN: приложение для авторов Telegram-каналов"
              sizes="180px"
            />
          </motion.div>

          <motion.div
            style={{ y: centerY, scale: centerScale }}
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
            style={{ y: sideY, x: rightX, scale: sideScale }}
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
