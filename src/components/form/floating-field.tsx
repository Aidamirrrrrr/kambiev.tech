"use client";

/** Поле ввода с плавающей подписью. */

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

export function FloatingField({
  label,
  type = "text",
  required = true,
  value,
  onChange,
  index,
  isInView,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  index: number;
  isInView: boolean;
}) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const isActive = focused || value.length > 0;
  const isEmpty = touched && required && value.trim().length === 0;
  const isInvalidEmail =
    touched &&
    type === "email" &&
    value.length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
      className="group relative"
    >
      <input
        id={fieldId}
        type={type}
        required={required}
        aria-invalid={isEmpty || isInvalidEmail}
        aria-describedby={isEmpty ? errorId : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setTouched(true);
        }}
        className={`peer w-full border-b-2 bg-transparent pb-2 pt-6 text-sm text-fg outline-none transition-all duration-300 ${
          isEmpty || isInvalidEmail
            ? "border-red-600"
            : focused
              ? "border-accent"
              : "border-line-strong hover:border-fg-dim"
        }`}
      />
      <label
        htmlFor={fieldId}
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${
          isActive ? "top-0 text-[11px] tracking-wider" : "top-5 text-sm"
        } ${
          isEmpty || isInvalidEmail
            ? "text-red-600"
            : focused
              ? "text-fg"
              : "text-fg-muted"
        }`}
      >
        {label}
      </label>
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-fg"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
      />
      <AnimatePresence>
        {isEmpty && (
          <motion.span
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="-bottom-5 absolute left-0 text-[11px] text-red-600"
          >
            {label}
          </motion.span>
        )}
        {isInvalidEmail && (
          <motion.span
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="-bottom-5 absolute left-0 text-[11px] text-red-600"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
