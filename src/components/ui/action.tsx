import type { ReactNode } from "react";
import { LocaleTransition } from "@/components/locale-transition";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-medium text-base transition-colors duration-300";

const variants = {
  solid: "bg-accent text-page hover:bg-accent-strong",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-page",
} as const;

export function Action({
  href,
  variant = "solid",
  external = false,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`${base} ${variants[variant]}`}
    >
      <LocaleTransition className="inline">{children}</LocaleTransition>
    </a>
  );
}

/** Пара кнопок в ряд, на узком экране одна под другой. */
export function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      {children}
    </div>
  );
}
