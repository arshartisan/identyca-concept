"use client";

import { useEffect, useState } from "react";
import { cx } from "@/utils/cx";
import type { Heading } from "./markdown";

/**
 * Sticky "On this page" rail. Highlights the section currently nearest the
 * top of the viewport. Rendered only on lg+ by its parent.
 */
export function TableOfContents({
  headings,
  label = "On this page",
  className,
}: {
  headings: Heading[];
  label?: string;
  className?: string;
}) {
  const [active, setActive] = useState<string | undefined>(headings[0]?.id);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const onScroll = () => {
      const line = 140;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
        else break;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label={label} className={cx("flex flex-col gap-4", className)}>
      <span className="eyebrow text-text-tertiary">{label}</span>
      <ol className="relative flex flex-col border-s border-border-hairline">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cx(
                  "-ms-px block border-s py-1.5 ps-4 text-body-medium leading-5 transition-colors duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  isActive
                    ? "border-signal text-text-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary",
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
