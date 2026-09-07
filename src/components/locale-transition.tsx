"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useI18n } from "@/lib/i18n";

/** Смена языка со сдвигом вверх. Контейнер держит размер, чтобы не дёргалась раскладка. */
export function LocaleTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { locale } = useI18n();
  const prevLocale = useRef(locale);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [displayChildren, setDisplayChildren] = useState(children);

  const latestChildren = useRef(children);
  latestChildren.current = children;

  useEffect(() => {
    if (prevLocale.current !== locale) {
      prevLocale.current = locale;

      setPhase("out");

      const t1 = setTimeout(() => {
        setDisplayChildren(latestChildren.current);
        setPhase("in");
      }, 200);

      const t2 = setTimeout(() => {
        setPhase("idle");
      }, 500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    setDisplayChildren(children);
  }, [locale, children]);

  const getStyle = useCallback((): React.CSSProperties => {
    switch (phase) {
      case "out":
        return {
          transform: "translateY(-100%)",
          opacity: 0,
          transition:
            "transform 0.2s cubic-bezier(0.4, 0, 1, 1), opacity 0.15s ease",
        };
      case "in":
        return {
          transform: "translateY(0)",
          opacity: 1,
          transition:
            "transform 0.3s cubic-bezier(0, 0, 0.2, 1), opacity 0.3s ease",
        };
      default:
        return {
          transform: "translateY(0)",
          opacity: 1,
          transition: "none",
        };
    }
  }, [phase]);

  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (phase === "in") {
      setMounted(false);
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }
  }, [phase]);

  const inStartStyle: React.CSSProperties =
    phase === "in" && !mounted
      ? { transform: "translateY(60%)", opacity: 0, transition: "none" }
      : getStyle();

  return (
    <span
      className={className}
      style={{
        // clip вместо hidden + поле: обрезка отодвигается от строчного бокса,
        // иначе паддинг и бордер вложенного значка срезаются сверху и снизу.
        // Раскладка и базовая линия при этом не меняются.
        overflow: "clip",
        overflowClipMargin: "0.35em",
        display: "inline-block",
        verticalAlign: "baseline",
      }}
    >
      <span
        style={{
          display: "inline-block",
          ...inStartStyle,
        }}
      >
        {displayChildren}
      </span>
    </span>
  );
}
