"use client";

/** Техническая конкретика прячется сюда, чтобы верхний слой оставался коротким. */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

export function Disclosure({
  label,
  labelOpen,
  children,
  align = "start",
}: {
  label: string;
  labelOpen: string;
  children: ReactNode;
  align?: "start" | "center";
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className={align === "center" ? "flex flex-col items-center" : ""}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={regionId}
        className="inline-flex items-center gap-1 font-medium text-accent text-base transition-colors hover:text-accent-strong"
      >
        {open ? labelOpen : label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*
        Содержимое рендерится всегда и сворачивается высотой, а не
        размонтированием. Раньше свёрнутый блок отсутствовал в DOM, и весь
        технический текст не попадал в HTML: робот кнопки не нажимает, поэтому
        для поиска этой части сайта просто не существовало.

        inert убирает свёрнутое из фокуса и из проговаривания скринридером,
        иначе текст был бы доступен клавиатуре, оставаясь невидимым.
      */}
      <motion.div
        id={regionId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        inert={!open}
        className="w-full overflow-hidden"
      >
        <div className="pt-6">{children}</div>
      </motion.div>
    </div>
  );
}
