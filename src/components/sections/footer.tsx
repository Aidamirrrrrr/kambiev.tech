"use client";

import { LocaleTransition } from "@/components/locale-transition";
import { useI18n } from "@/lib/i18n";
import { socialLinks } from "@/lib/social";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const footerLinks = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.work, href: "#work" },
    { label: t.nav.stack, href: "#stack" },
  ];

  return (
    <footer className="relative z-10 border-t border-line bg-page py-8">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-fg-muted text-xs">
              <span>&copy; {year}</span>
              <span>·</span>
              <LocaleTransition className="inline">
                <span>{t.footer.rights}</span>
              </LocaleTransition>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                <LocaleTransition className="inline">
                  {link.label}
                </LocaleTransition>
              </a>
            ))}
            <a
              href="/privacy"
              className="text-fg-muted text-xs transition-colors duration-200 hover:text-fg"
            >
              <LocaleTransition className="inline">
                {t.ui.privacy}
              </LocaleTransition>
            </a>
            <span className="h-3 w-px bg-line" />
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
