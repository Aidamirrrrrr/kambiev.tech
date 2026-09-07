"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LocaleTransition } from "@/components/locale-transition";
import { Logo } from "@/components/ui/logo";
import { type Locale, useI18n } from "@/lib/i18n";

const localeOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const { locale, t, setLocale } = useI18n();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.experience, href: "#experience" },
    { name: t.nav.work, href: "#work" },
    { name: t.nav.stack, href: "#stack" },
    { name: t.nav.contact, href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          mobileOpen
            ? "bg-page"
            : scrolled
              ? "border-line border-b bg-page/80 backdrop-blur-2xl backdrop-saturate-150"
              : "border-transparent border-b bg-page/70 backdrop-blur-2xl backdrop-saturate-150"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* biome-ignore lint/a11y/useValidAnchor: это навигация к якорю, onClick лишь закрывает меню */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 font-medium text-base text-fg tracking-tight transition-opacity duration-300 hover:opacity-60"
            onClick={() => setMobileOpen(false)}
          >
            <Logo className="h-7 w-7 shrink-0" />
            <LocaleTransition className="inline">
              {t.nav.wordmark}
            </LocaleTransition>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-fg-muted text-sm transition-colors duration-300 hover:text-fg"
              >
                <LocaleTransition className="inline">
                  {item.name}
                </LocaleTransition>
                <span className="-bottom-1 absolute left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-fg-dim text-sm transition-colors duration-300 hover:text-fg"
              >
                {locale.toUpperCase()}
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 overflow-hidden rounded-lg border border-line bg-surface shadow-xl"
                  >
                    {localeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setLocale(opt.value);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 ${
                          locale === opt.value
                            ? "bg-accent/10 text-accent"
                            : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a
              href="#contact"
              className="hidden items-center gap-1 font-medium text-accent text-sm transition-colors duration-300 hover:text-accent-strong md:inline-flex"
            >
              <LocaleTransition className="inline">
                {t.nav.cta}
              </LocaleTransition>
              <span className="leading-none">&rarr;</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative flex h-8 w-8 items-center justify-center md:hidden"
              aria-label="Menu"
            >
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 0 : -4,
                }}
                transition={{ duration: 0.3 }}
                className="absolute h-px w-5 bg-fg"
              />
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? 0 : 4,
                }}
                transition={{ duration: 0.3 }}
                className="absolute h-px w-5 bg-fg"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-page px-6 pt-24 pb-12 md:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-2">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="py-3 font-semibold text-3xl text-fg tracking-tight transition-colors hover:text-accent"
                >
                  <LocaleTransition className="inline">
                    {item.name}
                  </LocaleTransition>
                </motion.a>
              ))}
            </div>

            {/* biome-ignore lint/a11y/useValidAnchor: это навигация к якорю, onClick лишь закрывает меню */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-medium text-base text-page"
            >
              <LocaleTransition className="inline">
                {t.nav.cta}
              </LocaleTransition>
              <span>&rarr;</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
