/** Внешние профили. Используются и в контактах, и в подвале. */

import { site } from "./site";

export const socialLinks = [
  { label: "GitHub", href: site.github },
  { label: "Telegram", href: site.telegram },
] as const;
