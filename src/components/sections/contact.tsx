"use client";

/** Секция контактов: форма уходит в Telegram, рядом прямые контакты. */

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Send } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { FloatingField } from "@/components/form/floating-field";
import { FloatingTextarea } from "@/components/form/floating-textarea";
import { LocaleTransition } from "@/components/locale-transition";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";
import { socialLinks } from "@/lib/social";

const EMAIL = site.email;

function ContactForm({
  isInView,
  locale,
}: {
  isInView: boolean;
  locale: string;
}) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      formData.contact.trim().length < 3 ||
      !formData.message.trim()
    ) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (!res.ok) throw new Error();

      setSubmitted(true);
      setFormData({ name: "", contact: "", message: "" });
      setFormKey((k) => k + 1);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col gap-8"
    >
      <div key={formKey} className="flex flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <FloatingField
            label={t.contact.nameLabel}
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            index={0}
            isInView={isInView}
          />
          <FloatingField
            label={t.contact.contactLabel}
            value={formData.contact}
            onChange={(val) => setFormData({ ...formData, contact: val })}
            index={1}
            isInView={isInView}
          />
        </div>
        <FloatingTextarea
          label={t.contact.messageLabel}
          value={formData.message}
          onChange={(val) => setFormData({ ...formData, message: val })}
          isInView={isInView}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.44 }}
        className="pt-2"
      >
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`group inline-flex items-center gap-3 rounded-full border px-8 py-3.5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
            submitted
              ? "border-accent bg-accent text-page"
              : error
                ? "border-red-600 bg-red-600 text-page"
                : "border-accent bg-accent text-page hover:bg-accent-strong disabled:opacity-70"
          }`}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {t.contact.sent}
              </motion.span>
            ) : error ? (
              <motion.span
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-page"
              >
                {t.contact.error}
              </motion.span>
            ) : loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-2"
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-page border-t-transparent" />
                {t.contact.sending}
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-3"
              >
                {t.contact.send}
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/*
          Обёртка смены языка рендерится как inline-block, поэтому оборачивать
          в неё сам абзац нельзя: он встаёт в строку рядом с кнопкой.
          Блочный <p> снаружи, анимация языка — только вокруг текста.
        */}
        <p className="mt-6 max-w-md text-fg-dim text-xs leading-relaxed">
          <LocaleTransition className="inline">{t.ui.consent}</LocaleTransition>{" "}
          <a
            href="/privacy"
            className="text-accent underline-offset-2 hover:underline"
          >
            <LocaleTransition className="inline">
              {t.ui.privacy}
            </LocaleTransition>
          </a>
        </p>
      </motion.div>
    </motion.form>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });
  const { t, locale } = useI18n();

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <LocaleTransition>
            <h2 className="font-semibold text-4xl text-fg tracking-tight sm:text-5xl">
              {t.contact.title} {t.contact.titleAccent}
            </h2>
          </LocaleTransition>
          <LocaleTransition>
            <p className="mx-auto mt-6 max-w-2xl text-fg-muted text-lg leading-relaxed">
              {t.contact.text}
            </p>
          </LocaleTransition>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <div className="lg:col-span-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-14"
            >
              <MagneticLink
                href={`mailto:${EMAIL}`}
                className="group relative inline-block"
              >
                <span className="text-xl font-bold tracking-tight text-fg transition-colors duration-300 group-hover:text-fg-muted sm:text-3xl lg:text-4xl">
                  {EMAIL}
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-px w-full origin-left bg-line-strong"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </MagneticLink>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted transition-colors duration-300 hover:text-fg"
                  >
                    <span className="inline-block h-1 w-1 rounded-full bg-line-strong transition-colors duration-300 group-hover:bg-fg" />
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>

            <ContactForm isInView={isInView} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
