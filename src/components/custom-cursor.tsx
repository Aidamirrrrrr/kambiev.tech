"use client";

/** Мягкий след за системным курсором и волна по клику. */

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(isTouchDevice);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsPressed(true);
      setRipples((prev) => [
        ...prev,
        { id: Date.now(), x: e.clientX, y: e.clientY },
      ]);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="pointer-events-none fixed top-0 left-0 z-9997"
            style={{
              x: ripple.x,
              y: ripple.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => removeRipple(ripple.id)}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                borderWidth: 2,
                borderColor: "rgba(0,0,0,0.4)",
                borderStyle: "solid",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.3)",
              }}
              initial={{
                width: 0,
                height: 0,
                x: "-50%",
                y: "-50%",
                opacity: 1,
              }}
              animate={{
                width: 80,
                height: 80,
                x: "-50%",
                y: "-50%",
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                borderWidth: 1.5,
                borderColor: "rgba(0,0,0,0.25)",
                borderStyle: "solid",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
              }}
              initial={{
                width: 0,
                height: 0,
                x: "-50%",
                y: "-50%",
                opacity: 0.8,
              }}
              animate={{
                width: 120,
                height: 120,
                x: "-50%",
                y: "-50%",
                opacity: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                background: "rgba(0,0,0,0.3)",
                boxShadow: "0 0 4px rgba(0,0,0,0.2)",
              }}
              initial={{
                width: 12,
                height: 12,
                x: "-50%",
                y: "-50%",
                opacity: 1,
              }}
              animate={{
                width: 0,
                height: 0,
                x: "-50%",
                y: "-50%",
                opacity: 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/*
        Системный курсор остаётся на месте, а это мягкий след за ним:
        подсветка с запаздыванием, которая подрастает над кликабельным.
        Раньше компонент прятал родную стрелку целиком и рисовал кольцо
        вместо неё — теперь он только дополняет её, а не подменяет.
      */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-9998"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isPressed ? 18 : isHovering ? 44 : 26,
            height: isPressed ? 18 : isHovering ? 44 : 26,
            opacity: isVisible ? 1 : 0,
            backgroundColor: isHovering
              ? "rgba(0,102,204,0.10)"
              : "rgba(29,29,31,0.05)",
            borderColor: isHovering
              ? "rgba(0,102,204,0.35)"
              : "rgba(29,29,31,0.14)",
          }}
          transition={{ duration: isPressed ? 0.12 : 0.26, ease: "easeOut" }}
          className="rounded-full border"
        />
      </motion.div>
    </>
  );
}
