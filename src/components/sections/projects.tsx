"use client";

/** Снимок несёт основную нагрузку: без него секция читается как рамка с текстом. */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Disclosure } from "@/components/disclosure";
import { LocaleTransition } from "@/components/locale-transition";
import { ProjectBand } from "@/components/sections/project-band";
import { Action, Actions } from "@/components/ui/action";
import { useI18n } from "@/lib/i18n";
import { getMoreProjects, getProjects } from "@/lib/projects";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const moreRef = useRef<HTMLDivElement>(null);
  const moreInView = useInView(moreRef, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const projects = getProjects(t);
  const moreProjects = getMoreProjects(t);
  const labels = {
    more: t.ui.more,
    less: t.ui.less,
    whatInside: t.ui.whatInside,
  };

  return (
    <section id="work" className="bg-page">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 32 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-4xl px-6 pt-24 text-center sm:pt-32"
      >
        <LocaleTransition>
          <h2 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl lg:text-6xl">
            {t.projects.title} {t.projects.titleAccent}
          </h2>
        </LocaleTransition>
      </motion.div>

      {projects.map((project, i) => (
        <ProjectBand
          key={project.title}
          project={project}
          index={i}
          labels={labels}
        />
      ))}

      <motion.div
        ref={moreRef}
        initial={{ opacity: 0, y: 24 }}
        animate={moreInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32"
      >
        <h3 className="font-semibold text-2xl text-fg tracking-tight sm:text-3xl">
          <LocaleTransition className="inline">
            {t.projects.moreTitle}
          </LocaleTransition>
        </h3>

        <div className="mt-8">
          <Disclosure align="center" label={t.ui.more} labelOpen={t.ui.less}>
            <ul className="mx-auto max-w-3xl divide-y divide-line border-line border-t text-left">
              {moreProjects.map((project) => (
                <li key={project.name} className="py-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-semibold text-fg text-lg">
                      {project.name}
                    </h4>
                    <span className="shrink-0 text-fg-dim text-sm">
                      {project.year}
                    </span>
                  </div>
                  <LocaleTransition>
                    <p className="mt-2 text-base text-fg-muted leading-relaxed">
                      {project.description}
                    </p>
                  </LocaleTransition>
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>

        {/*
          Призыв прямо под работами: следующая секция с формой лежит через два
          экрана, и убеждённому проектами читателю пришлось бы её искать.
        */}
        <div className="mt-16 border-line border-t pt-16">
          <p className="text-fg-muted text-xl leading-relaxed">
            <LocaleTransition className="inline">
              {t.projects.ctaText}
            </LocaleTransition>
          </p>
          <div className="mt-8">
            <Actions>
              <Action href="#contact">{t.projects.cta}</Action>
              <Action href={site.telegram} variant="outline" external>
                {t.ctaBanner.ctaTelegram}
              </Action>
            </Actions>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
