"use client";

/**
 * Раскрытие подробностей по клику.
 *
 * Верхний слой страницы держим коротким и понятным любому читателю,
 * а техническую конкретику прячем сюда: тот, кому она нужна, разворачивает
 * её сам. Кнопка несёт aria-expanded, поэтому состояние доступно скринридеру.
 */

import { AnimatePresence, motion } from "framer-motion";
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
        // Раскрытый блок существует в DOM только когда открыт, поэтому
        // и ссылка на него ставится только тогда. Заодно это убирает
        // расхождение при гидратации: на сервере атрибута нет, на клиенте
        // при первом рендере тоже.
        aria-controls={open ? regionId : undefined}
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

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={regionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <div className="pt-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
