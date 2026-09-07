"use client";

/** Секция контактов: форма уходит в Telegram, рядом прямые контакты. */

import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { FloatingField } from "@/components/form/floating-field";
import { FloatingTextarea } from "@/components/form/floating-textarea";
import { LocaleTransition } from "@/components/locale-transition";
import { MagneticLink } from "@/components/ui/magnetic-link";
import {
  detectContactKind,
  formatPhone,
  isContactValid,
} from "@/lib/contact-field";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";
import { socialLinks } from "@/lib/social";

const EMAIL = site.email;

/** Маска включается только когда человек явно набирает номер. */
function maskContact(value: string): string {
  return detectContactKind(value) === "phone" ? formatPhone(value) : value;
}

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
  const [showErrors, setShowErrors] = useState(false);

  // Ошибки считаются от текущих значений, а поле само решает, показывать ли
  // их: пока в него не заходили, ругаться не на что.
  const errors = {
    name: formData.name.trim() ? undefined : t.contact.errName,
    contact: !formData.contact.trim()
      ? t.contact.errContact
      : isContactValid(formData.contact)
        ? undefined
        : t.contact.errContactInvalid,
    message: formData.message.trim() ? undefined : t.contact.errMessage,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Раньше форма молча делала return, и нажатие выглядело как поломка.
    if (hasErrors) {
      setShowErrors(true);
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
      if (!res.ok) throw new Error(String(res.status));

      setSubmitted(true);
      setFormData({ name: "", contact: "", message: "" });
      setShowErrors(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Подтверждение заменяет форму и никуда не исчезает само. Раньше оно было
   * надписью на кнопке того же цвета, что и обычная, и гасло через четыре
   * секунды, поэтому отправка выглядела так, будто ничего не произошло.
   */
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        role="status"
        className="rounded-2xl border border-accent/30 bg-accent/5 p-8"
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent"
          >
            <Check className="h-4 w-4 text-page" strokeWidth={3} />
          </span>
          <div>
            <p className="font-semibold text-fg text-lg tracking-tight">
              <LocaleTransition className="inline">
                {t.contact.sentTitle}
              </LocaleTransition>
            </p>
            <p className="mt-1 text-base text-fg-muted leading-relaxed">
              <LocaleTransition className="inline">
                {t.contact.sentText}
              </LocaleTransition>
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 font-medium text-accent text-base transition-colors hover:text-accent-strong"
            >
              <LocaleTransition className="inline">
                {t.contact.sendMore}
              </LocaleTransition>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FloatingField
          label={t.contact.nameLabel}
          value={formData.name}
          onChange={(val) => setFormData({ ...formData, name: val })}
          error={showErrors ? errors.name : undefined}
          autoComplete="name"
          index={0}
          isInView={isInView}
        />
        <FloatingField
          label={t.contact.contactLabel}
          value={formData.contact}
          onChange={(val) =>
            setFormData({ ...formData, contact: maskContact(val) })
          }
          error={showErrors ? errors.contact : undefined}
          hint={t.contact.contactHint}
          inputMode={
            detectContactKind(formData.contact) === "phone" ? "tel" : "email"
          }
          index={1}
          isInView={isInView}
        />
      </div>

      <FloatingTextarea
        label={t.contact.messageLabel}
        value={formData.message}
        onChange={(val) => setFormData({ ...formData, message: val })}
        error={showErrors ? errors.message : undefined}
        isInView={isInView}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.44 }}
      >
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-3.5 font-medium text-base text-page transition-colors duration-300 hover:bg-accent-strong disabled:opacity-70"
        >
          {loading && (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-page border-t-transparent"
            />
          )}
          <LocaleTransition className="inline">
            {loading ? t.contact.sending : t.contact.send}
          </LocaleTransition>
        </button>

        {error && (
          <p role="alert" className="mt-4 text-base text-red-600">
            <LocaleTransition className="inline">
              {t.contact.error}
            </LocaleTransition>
          </p>
        )}

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
