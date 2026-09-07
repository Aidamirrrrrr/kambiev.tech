"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Плавная прокрутка это перехват нативного скролла, поэтому при системной
    // настройке «меньше движения» оставляем браузерное поведение.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let lenis: Lenis | null = null;
    let frame = 0;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        touchMultiplier: 2,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    }

    /*
     * Клики по якорям Lenis сам не перехватывает: браузер уводит страницу
     * мгновенным прыжком мимо него, и плавность оставалась только на колесе.
     * Поэтому ссылки вида «#work» обрабатываем сами.
     */
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as HTMLElement | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();

      // Шапка фиксированная, поэтому цель поднимаем на её высоту, иначе
      // заголовок секции оказывается под навигацией.
      const nav = document.querySelector("nav");
      const offset = nav ? -(nav.getBoundingClientRect().height + 8) : 0;

      /*
       * Мобильное меню закрывается тем же кликом и только потом снимает
       * overflow: hidden с body. Ждём кадр, иначе прокрутка стартует
       * по ещё заблокированной странице и никуда не едет.
       */
      requestAnimationFrame(() => {
        if (lenis) {
          lenis.scrollTo(target, { offset });
        } else {
          const top =
            target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "auto" });
        }
        history.pushState(null, "", href);
      });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      // Раньше цикл rAF продолжал крутиться после destroy: ссылка на кадр
      // никуда не сохранялась и отменить его было нечем.
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
