"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";

export function FloatingTextarea({
  label,
  value,
  onChange,
  error,
  isInView,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  isInView: boolean;
}) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;
  const showError = Boolean(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.36 }}
      className="group relative pb-6"
    >
      <textarea
        id={fieldId}
        rows={4}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        /* 16px: иначе Safari на iOS увеличивает страницу при фокусе. */
        className={`peer w-full resize-none border-b-2 bg-transparent pt-6 pb-2 text-base text-fg outline-none transition-colors duration-300 ${
          showError
            ? "border-red-600"
            : focused
              ? "border-accent"
              : "border-line-strong hover:border-fg-dim"
        }`}
      />
      <label
        htmlFor={fieldId}
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${
          isActive ? "top-0 text-xs tracking-wide" : "top-6 text-base"
        } ${showError ? "text-red-600" : focused ? "text-fg" : "text-fg-muted"}`}
      >
        {label}
      </label>

      <AnimatePresence>
        {showError && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 text-red-600 text-xs leading-snug"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
