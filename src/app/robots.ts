/**
 * robots.txt.
 *
 * Отдельно и явно разрешены краулеры ИИ-поиска. По умолчанию правило `*`
 * их и так пропускает, но часть из них ищет своё имя в файле, а явное
 * разрешение снимает вопрос, если правила когда-нибудь ужесточат.
 */

import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "cohere-ai",
  "YandexBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
