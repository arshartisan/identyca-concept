"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honors the OS reduced-motion setting for every motion component (transforms are skipped). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
