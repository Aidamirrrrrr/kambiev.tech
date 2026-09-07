"use client";

import { animate, motion, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { Disclosure } from "@/components/disclosure";
import { LocaleTransition } from "@/components/locale-transition";
import { useI18n } from "@/lib/i18n";

/** Секция «О себе»: возможности, цифры и раскрытие с подробностями. */

function Counter({
  value,
  suffix = "",
  decimals = 0,
  started,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  started: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (started) {
      const controls = animate(motionValue, value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [started, motionValue, value]);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      if (ref.current) {
        const display =
          decimals > 0
            ? latest.toFixed(decimals)
            : Math.floor(latest).toString();
        ref.current.textContent = `${display}${suffix}`;
      }
    });
    return unsubscribe;
  }, [motionValue, suffix, decimals]);

  return <span ref={ref}>0{suffix}</span>;
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "50px" });
  const { t } = useI18n();

  const stats = [
    { value: 4, suffix: "", decimals: 0, label: t.about.stat1 },
    { value: 10, suffix: "+", decimals: 0, label: t.about.stat2 },
    { value: 2000, suffix: "+", decimals: 0, label: t.about.stat3 },
    { value: 3, suffix: "", decimals: 0, label: t.about.stat4 },
  ];

  return (
    <section id="about" ref={sectionRef} className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <LocaleTransition>
            <h2 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
              {t.about.title} {t.about.titleAccent}
            </h2>
          </LocaleTransition>

          <LocaleTransition>
            <p className="mx-auto mt-6 max-w-3xl text-fg-muted text-xl leading-relaxed">
              {t.about.text1}
            </p>
          </LocaleTransition>

          <div className="mt-8">
            <Disclosure align="center" label={t.ui.more} labelOpen={t.ui.less}>
              <LocaleTransition>
                <p className="mx-auto max-w-3xl text-base text-fg-muted leading-relaxed">
                  {t.about.text2}
                </p>
              </LocaleTransition>
            </Disclosure>
          </div>
        </motion.div>

        {/*
          Три полосы возможностей. Раньше секция была заголовком, абзацем
          и цифрами — на широком экране это выглядело пустым.
        */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid gap-8 text-left sm:grid-cols-3"
        >
          {[
            { t: t.about.cap1t, d: t.about.cap1d },
            { t: t.about.cap2t, d: t.about.cap2d },
            { t: t.about.cap3t, d: t.about.cap3d },
          ].map((cap) => (
            <div key={cap.t} className="border-line border-t pt-5">
              <h3 className="font-semibold text-fg text-lg tracking-tight">
                <LocaleTransition className="inline">{cap.t}</LocaleTransition>
              </h3>
              <LocaleTransition>
                <p className="mt-2 text-base text-fg-muted leading-relaxed">
                  {cap.d}
                </p>
              </LocaleTransition>
            </div>
          ))}
        </motion.div>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="block font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  started={statsInView}
                />
              </span>
              <LocaleTransition>
                <span className="mt-2 block text-fg-dim text-sm leading-snug">
                  {stat.label}
                </span>
              </LocaleTransition>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
