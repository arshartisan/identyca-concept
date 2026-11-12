"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Inertial page scroll (desktop pointers only; touch keeps native scrolling). */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.style.scrollBehavior = "auto";
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -88 } });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
  return null;
}
