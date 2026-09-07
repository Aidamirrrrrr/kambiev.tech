"use client";

/** Полоса одного проекта: снимок, три факта и раскрытие с деталями. */

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrowserFrame, PhoneFrame } from "@/components/device-frame";
import { Disclosure } from "@/components/disclosure";
import { LocaleTransition } from "@/components/locale-transition";
import type { Media as MediaKind, Project, Shot } from "@/lib/projects";

const ease = [0.16, 1, 0.3, 1] as const;

function PhoneRow({ items }: { items: Shot[] }) {
  return (
    <div className="flex items-start justify-center gap-4 sm:gap-10">
      {items.map((item) => (
        <PhoneFrame
          key={item.src}
          src={item.src}
          alt={item.alt}
          caption={item.caption}
          sizes="(max-width: 640px) 42vw, 260px"
          className="w-[42%] max-w-[260px]"
        />
      ))}
    </div>
  );
}

function Media({ media, title }: { media: MediaKind; title: string }) {
  if (media.kind === "browser") {
    return (
      <BrowserFrame
        src={media.src}
        alt={`${title}: интерфейс`}
        host={media.host}
        sizes="(max-width: 1200px) 100vw, 1152px"
      />
    );
  }
  if (media.kind === "phones") {
    return <PhoneRow items={media.items} />;
  }
  if (media.kind === "browser+phones") {
    return (
      <div className="space-y-12">
        <BrowserFrame
          src={media.src}
          alt={`${title}: сайт`}
          host={media.host}
          sizes="(max-width: 1200px) 100vw, 1152px"
        />
        <PhoneRow items={media.items} />
      </div>
    );
  }
  return null;
}

export function ProjectBand({
  project,
  index,
  labels,
}: {
  project: Project;
  index: number;
  labels: {
    more: string;
    less: string;
    whatInside: string;
  };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const onGray = index % 2 === 1;

  /*
   * Три слоя идут с разной скоростью, поэтому полоса читается глубиной.
   * Смещения в пикселях, а не в процентах: высота кадра гуляет от 500 до 1172
   * пикселей, и на процентах большие полосы наезжали бы на список фактов.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [72, -72]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);
  const factsY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    <div ref={ref} className={onGray ? "bg-surface" : "bg-page"}>
      <motion.article
        initial={{ opacity: 0, y: 56 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease }}
        className="mx-auto max-w-6xl px-6 py-24 sm:py-32"
      >
        <motion.div
          style={{ y: headY }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="font-medium text-accent text-sm">
            <LocaleTransition className="inline">
              {project.category}
            </LocaleTransition>
          </p>

          <h3 className="mt-3 font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
            {project.title}
          </h3>

          <p className="mx-auto mt-5 max-w-3xl text-fg-muted text-xl leading-relaxed">
            <LocaleTransition>{project.short}</LocaleTransition>
          </p>
        </motion.div>

        {project.media.kind !== "none" && (
          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            className="mt-20 origin-bottom sm:mt-24"
          >
            <Media media={project.media} title={project.title} />
          </motion.div>
        )}

        {/* Просто факты, а не пары «термин-определение», поэтому ul, а не dl. */}
        <motion.ul
          style={{ y: factsY }}
          className="mt-20 grid gap-x-8 gap-y-6 sm:mt-24 sm:grid-cols-3"
        >
          {project.facts.map((fact) => (
            <li
              key={fact}
              className="border-line border-t pt-5 text-base text-fg leading-snug"
            >
              <LocaleTransition>{fact}</LocaleTransition>
            </li>
          ))}
        </motion.ul>

        <div className="mt-10 flex justify-center">
          <Disclosure
            align="center"
            label={labels.more}
            labelOpen={labels.less}
          >
            <div className="mx-auto max-w-3xl text-left">
              <p className="font-medium text-fg-dim text-xs uppercase tracking-[0.12em]">
                <LocaleTransition className="inline">
                  {labels.whatInside}
                </LocaleTransition>
              </p>
              <p className="mt-3 text-base text-fg-muted leading-relaxed">
                <LocaleTransition>{project.description}</LocaleTransition>
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-2 px-3 py-1 text-fg-muted text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-fg-dim text-sm">{project.year}</p>
            </div>
          </Disclosure>
        </div>
      </motion.article>
    </div>
  );
}
