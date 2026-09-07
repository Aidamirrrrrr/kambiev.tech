/**
 * Рамки устройств для снимков продуктов.
 *
 * Без рамки скриншот читается как случайная картинка. Рамка задаёт масштаб
 * и сразу говорит, где это открыто: в браузере или на телефоне.
 */

import Image from "next/image";

/** Окно браузера с адресной строкой. */
export function BrowserFrame({
  src,
  alt,
  host,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  host: string;
  /** Реальная ширина кадра на странице. Без неё браузер тянет лишние килобайты. */
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.28)] sm:rounded-2xl">
      <div className="flex items-center gap-2 border-line border-b bg-surface px-3 py-2.5 sm:px-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-page px-3 py-1 text-fg-dim text-xs">
          {host}
        </span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={2200}
        height={1375}
        priority={priority}
        sizes={sizes}
        className="block w-full"
      />
    </div>
  );
}

/** Корпус телефона. */
export function PhoneFrame({
  src,
  alt,
  sizes,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  /** Реальная ширина кадра на странице. */
  sizes: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className="rounded-[2rem] border-[6px] border-fg bg-fg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] sm:rounded-[2.25rem] sm:border-[7px]">
        <Image
          src={src}
          alt={alt}
          width={900}
          height={1951}
          sizes={sizes}
          className="block w-full rounded-[1.6rem] sm:rounded-[1.75rem]"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-fg-dim text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
