"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";

export function FloatingField({
  label,
  type = "text",
  value,
  onChange,
  error,
  hint,
  inputMode,
  autoComplete,
  transform,
  index,
  isInView,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  hint?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
  transform?: (val: string) => string;
  index: number;
  isInView: boolean;
}) {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;
  const showError = Boolean(error);
  const message = showError ? error : hint;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
      className="group relative pb-6"
    >
      <input
        id={fieldId}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={showError}
        aria-describedby={message ? messageId : undefined}
        value={value}
        onChange={(e) =>
          onChange(transform ? transform(e.target.value) : e.target.value)
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        // 16px обязательны: Safari на iOS увеличивает страницу при фокусе
        // на поле с меньшим шрифтом, и вернуть масштаб потом нечем.
        className={`peer w-full border-b-2 bg-transparent pt-6 pb-2 text-base text-fg outline-none transition-colors duration-300 ${
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

      {/*
        Подсказка и ошибка живут в одном узле. Раньше они подменялись через
        AnimatePresence с mode="wait", и переход подсказка -> ошибка залипал:
        поле оставалось с подсказкой, хотя ошибка уже была передана.
      */}
      {message && (
        <p
          id={messageId}
          role={showError ? "alert" : undefined}
          className={`absolute bottom-0 left-0 text-xs leading-snug transition-colors duration-200 ${
            showError ? "text-red-600" : "text-fg-dim"
          }`}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
}
