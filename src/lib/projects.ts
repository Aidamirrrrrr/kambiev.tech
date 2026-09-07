/** Тексты живут в словарях, поэтому проекты собираются функцией от языка. */

import type { Dictionary } from "./dictionaries/types";

export type Shot = { src: string; alt: string; caption?: string };

export type Media =
  | { kind: "browser"; src: string; host: string }
  | { kind: "phones"; items: Shot[] }
  | { kind: "browser+phones"; src: string; host: string; items: Shot[] }
  | { kind: "none" };

export interface Project {
  title: string;
  category: string;
  year: string;
  short: string;
  facts: readonly string[];
  description: string;
  tags: string[];
  media: Media;
}

export function getProjects(t: Dictionary): Project[] {
  return [
    {
      title: "VELIZHANIN Platform",
      category: t.projects.p1cat,
      year: "2026",
      short: t.projects.p1short,
      facts: t.projects.p1facts,
      description: t.projects.p1desc,
      tags: ["NestJS", "BullMQ", "Turborepo", "Telegram Mini Apps"],
      media: {
        kind: "phones",
        items: [
          {
            src: "/work/velizhanin.webp",
            alt: "VELIZHANIN: главный экран приложения",
            caption: t.ui.shotApp,
          },
          {
            src: "/work/velizhanin-nav.webp",
            alt: "VELIZHANIN: навигация по каналу в Telegram",
            caption: t.ui.shotMiniApp,
          },
        ],
      },
    },
    {
      title: "FlowAi",
      category: t.projects.p3cat,
      year: "2024",
      short: t.projects.p3short,
      facts: t.projects.p3facts,
      description: t.projects.p3desc,
      tags: ["Next.js", "FSD", "WebSocket", "SSR"],
      media: { kind: "browser", src: "/work/flowai.webp", host: "flowai.ru" },
    },
    {
      title: "Global Dent Club",
      category: t.projects.p4cat,
      year: "2026",
      short: t.projects.p4short,
      facts: t.projects.p4facts,
      description: t.projects.p4desc,
      tags: ["NestJS", "Bitrix24", "GetCourse", "ЮKassa"],
      media: {
        kind: "browser",
        src: "/work/globaldent.webp",
        host: "admin",
      },
    },
    {
      title: "ELEMENT Concept",
      category: t.projects.p6cat,
      year: "2025",
      short: t.projects.p6short,
      facts: t.projects.p6facts,
      description: t.projects.p6desc,
      tags: ["HTML", "CSS", "JavaScript", "Bun"],
      media: {
        kind: "browser+phones",
        src: "/work/element.webp",
        host: "element-concept",
        items: [
          {
            src: "/work/element-mini.webp",
            alt: "ELEMENT Concept: каталог букетов в Telegram",
            caption: t.ui.shotCatalog,
          },
          {
            src: "/work/element-mini-2.webp",
            alt: "ELEMENT Concept: карточка букета с оплатой",
            caption: t.ui.shotCard,
          },
        ],
      },
    },
    {
      title: "NeonVPN",
      category: t.projects.p2cat,
      year: "2026",
      short: t.projects.p2short,
      facts: t.projects.p2facts,
      description: t.projects.p2desc,
      tags: ["NestJS", "Prisma", "ЮKassa", "Telegram"],
      media: {
        kind: "browser",
        src: "/work/neonvpn.webp",
        host: "neon-vpn.tech",
      },
    },
    {
      title: "Red Dragon Way",
      category: t.projects.p5cat,
      year: "2026",
      short: t.projects.p5short,
      facts: t.projects.p5facts,
      description: t.projects.p5desc,
      tags: ["Next.js", "TypeScript", "Telegram Bot API", "SEO"],
      media: { kind: "browser", src: "/work/rdw.webp", host: "reddragonway" },
    },
    {
      title: "Keel",
      category: t.projects.p7cat,
      year: "2026",
      short: t.projects.p7short,
      facts: t.projects.p7facts,
      description: t.projects.p7desc,
      tags: ["TypeScript", "VS Code API", "Ollama", "MCP"],
      media: { kind: "browser", src: "/work/keel.webp", host: "VS Code" },
    },
  ];
}

export function getMoreProjects(t: Dictionary) {
  return [
    { name: t.projects.m1name, description: t.projects.m1desc, year: "2026" },
    { name: t.projects.m2name, description: t.projects.m2desc, year: "2025" },
    { name: t.projects.m3name, description: t.projects.m3desc, year: "2025" },
    { name: t.projects.m5name, description: t.projects.m5desc, year: "2025" },
  ];
}
