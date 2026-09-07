/**
 * Знак сайта: монограмма в акцентном синем.
 *
 * Рисуется вектором, а не шрифтом: в шапке он стоит рядом с именем, набранным
 * Inter, и совпадение начертаний читалось бы как случайность, а не как знак.
 */

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="kambiev.tech"
      className={className}
    >
      <rect width="32" height="32" rx="8" className="fill-accent" />
      {/* A и K одной толщиной штриха, чтобы знак не рассыпался в 20 пикселей */}
      <path
        d="M7 22.5 11.4 9.5h2.2L18 22.5h-2.4l-.95-2.95h-4.3L9.4 22.5H7Zm3.95-4.85h3.1l-1.55-4.8-1.55 4.8Z"
        fill="#fff"
      />
      <path
        d="M19.4 22.5V9.5h2.25v5.6l4.5-5.6H29l-4.75 5.75L29.2 22.5h-2.75l-3.5-5.35-1.3 1.55v3.8H19.4Z"
        fill="#fff"
      />
    </svg>
  );
}
