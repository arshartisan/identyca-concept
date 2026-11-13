"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Inertial page scroll (desktop pointers only; touch keeps native scrolling). */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.style.scrollBehavior = "auto";
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -88 } });
    lenisRef.current = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Lenis keeps its own scroll target across client navigations, so a new page
  // could open at the previous page's offset. Jump to the top on route change
  // (unless the URL targets an in-page anchor).
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
