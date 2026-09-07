"use client";

/**
 * Секция опыта работы.
 *
 * На виду только место, роль, срок и одна понятная фраза о том, чем я там
 * занимался. Результаты по пунктам и стек уезжают под «Подробнее»: без этого
 * секция занимала три экрана сплошного технического текста.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Disclosure } from "@/components/disclosure";
import { LocaleTransition } from "@/components/locale-transition";
import { useI18n } from "@/lib/i18n";

const jobKeys = ["e1", "e2", "e3", "e4"] as const;
const bulletKeys = ["b1", "b2", "b3", "b4"] as const;

const ease = [0.16, 1, 0.3, 1] as const;

type Job = {
  company: string;
  role: string;
  period: string;
  plain: string;
  summary: string;
  b1: string;
  b2: string;
  b3: string;
  b4: string;
  stack: string;
};

/** Одно место работы. */
function JobEntry({
  job,
  isCurrent,
  labels,
}: {
  job: Job;
  isCurrent: boolean;
  labels: { more: string; less: string; stack: string; now: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className="border-line border-t py-10 sm:py-12"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-semibold text-2xl text-fg tracking-tight">
          <LocaleTransition className="inline">{job.company}</LocaleTransition>
        </h3>
        {isCurrent && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-page text-xs">
            <LocaleTransition className="inline">{labels.now}</LocaleTransition>
          </span>
        )}
      </div>

      <p className="mt-1 text-fg-dim text-sm">
        <LocaleTransition className="inline">{job.role}</LocaleTransition>
        <span aria-hidden className="mx-2">
          ·
        </span>
        <LocaleTransition className="inline">{job.period}</LocaleTransition>
      </p>

      <p className="mt-4 max-w-3xl text-fg-muted text-lg leading-relaxed">
        <LocaleTransition>{job.plain}</LocaleTransition>
      </p>

      <div className="mt-6">
        <Disclosure label={labels.more} labelOpen={labels.less}>
          <div className="max-w-3xl">
            <p className="text-base text-fg-muted leading-relaxed">
              <LocaleTransition>{job.summary}</LocaleTransition>
            </p>

            <ul className="mt-5 space-y-3">
              {bulletKeys.map((k) => (
                <li
                  key={k}
                  className="flex gap-3 text-base text-fg-muted leading-relaxed"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong"
                  />
                  <LocaleTransition>{job[k]}</LocaleTransition>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-medium text-fg-dim text-xs uppercase tracking-[0.12em]">
              <LocaleTransition className="inline">
                {labels.stack}
              </LocaleTransition>
            </p>
            <p className="mt-2 text-fg-dim text-sm leading-relaxed">
              {job.stack}
            </p>
          </div>
        </Disclosure>
      </div>
    </motion.article>
  );
}

export function Experience() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const labels = {
    more: t.ui.more,
    less: t.ui.less,
    stack: t.experience.stackLabel,
    now: t.experience.now,
  };

  return (
    <section id="experience" className="bg-page py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="mb-12 text-center"
        >
          <LocaleTransition>
            <h2 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
              {t.experience.title} {t.experience.titleAccent}
            </h2>
          </LocaleTransition>
        </motion.div>

        <div className="border-line border-b">
          {jobKeys.map((key, i) => (
            <JobEntry
              key={key}
              job={t.experience[key]}
              isCurrent={i === 0}
              labels={labels}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
