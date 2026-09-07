"use client";

/** Техническая конкретика прячется сюда, чтобы верхний слой оставался коротким. */

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
        // Блок есть в DOM только когда открыт, поэтому и ссылка ставится только
        // тогда: иначе расходится гидратация.
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
