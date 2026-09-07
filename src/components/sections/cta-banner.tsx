"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LocaleTransition } from "@/components/locale-transition";
import { useI18n } from "@/lib/i18n";

export function CtaBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });
  const { t } = useI18n();

  const stats = [
    { value: t.ctaBanner.stat1val, label: t.ctaBanner.stat1label },
    { value: t.ctaBanner.stat2val, label: t.ctaBanner.stat2label },
    { value: t.ctaBanner.stat3val, label: t.ctaBanner.stat3label },
  ];

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

        <a
          href="#contact"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-medium text-base text-page transition-colors duration-300 hover:bg-accent-strong"
        >
          <LocaleTransition className="inline">
            {t.ctaBanner.cta}
          </LocaleTransition>
        </a>

        <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">
                <LocaleTransition className="inline">
                  {stat.label}
                </LocaleTransition>
              </dt>
              <dd>
                <span className="block font-semibold text-3xl text-fg tracking-tight">
                  <LocaleTransition className="inline">
                    {stat.value}
                  </LocaleTransition>
                </span>
                <LocaleTransition>
                  <span className="mt-1 block text-fg-dim text-sm">
                    {stat.label}
                  </span>
                </LocaleTransition>
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
