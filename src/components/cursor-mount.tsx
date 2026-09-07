"use client";

/**
 * Курсор декоративный, поэтому грузится отдельным куском и только на клиенте.
 * Обёртка нужна из-за ssr: false, недоступного в серверном компоненте.
 */

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((m) => m.CustomCursor),
  { ssr: false },
);

export function CursorMount() {
  return <CustomCursor />;
}
