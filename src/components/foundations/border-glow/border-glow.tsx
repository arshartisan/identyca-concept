"use client";

import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * Cursor-tracking edge glow, ported from React Bits "Border Glow"
 * (https://reactbits.dev/components/border-glow).
 *
 * Differences from the original:
 *  - Wraps an existing card instead of being the card: it adds no background or
 *    border of its own, so the card keeps its `overflow-hidden` and the outer
 *    bloom can still spill past the card edge.
 *  - Pointer moves write CSS custom properties (rAF-throttled) instead of React
 *    state, so tracking never re-renders the card's subtree.
 *  - Defaults use the Identyca logo palette (teal #00b8f0, orange #f88000).
 *
 * Layers (styles in styles/brand.css → "Border glow"):
 *  1. mesh-gradient 1px ring, revealed in a cone facing the cursor
 *  2. soft-light mesh fill hugging the inner edge
 *  3. outer + inner box-shadow bloom in a narrow cone
 */

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function meshGradient(colors: string[]) {
  const layers = GRADIENT_POSITIONS.map(
    (pos, i) => `radial-gradient(at ${pos}, ${colors[Math.min(COLOR_MAP[i], colors.length - 1)]} 0px, transparent 50%)`,
  );
  layers.push(`linear-gradient(${colors[0]} 0 100%)`);
  return layers.join(", ");
}

/** `glowColor` is "H S L" (no units), e.g. "194 90 68". */
function bloomShadow(glowColor: string, intensity: number) {
  const [h, s, l] = glowColor.split(/\s+/).map(parseFloat);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, boolean][] = [
    [0, 1, 100, true], [1, 0, 60, true], [3, 0, 50, true], [6, 0, 40, true], [15, 0, 30, true], [25, 2, 20, true], [50, 2, 10, true],
    [1, 0, 60, false], [3, 0, 50, false], [6, 0, 40, false], [15, 0, 30, false], [25, 2, 20, false], [50, 2, 10, false],
  ];
  return layers
    .map(([blur, spread, alpha, inset]) => `${inset ? "inset " : ""}0 0 ${blur}px ${spread}px hsl(${base} / ${Math.min(alpha * intensity, 100)}%)`)
    .join(", ");
}

const DEFAULT_COLORS = ["#00b8f0", "#f88000", "#7ed6fd"];

export function BorderGlow({
  children,
  className,
  radius = 24,
  edgeSensitivity = 30,
  glowColor = "194 90 68",
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.5,
}: {
  children: ReactNode;
  className?: string;
  /** Must match the wrapped card's corner radius (px). */
  radius?: number;
  /** 0–100: how close to the edge (from the centre) the bloom starts. */
  edgeSensitivity?: number;
  glowColor?: string;
  glowRadius?: number;
  glowIntensity?: number;
  /** % of the circle the border ring shows on each side of the cursor. */
  coneSpread?: number;
  colors?: string[];
  fillOpacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      const dx = clientX - r.left - cx;
      const dy = clientY - r.top - cy;
      // 0 at the centre → 1 on the edge (the nearer of the two axes wins)
      const edge = Math.min(Math.max(Math.max(Math.abs(dx) / cx, Math.abs(dy) / cy), 0), 1);
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;
      const colorSensitivity = edgeSensitivity + 20;
      el.style.setProperty("--glow-angle", `${angle.toFixed(2)}deg`);
      el.style.setProperty("--glow-border", `${Math.max(0, (edge * 100 - colorSensitivity) / (100 - colorSensitivity))}`);
      el.style.setProperty("--glow-outer", `${Math.max(0, (edge * 100 - edgeSensitivity) / (100 - edgeSensitivity))}`);
    },
    [edgeSensitivity],
  );

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => update(clientX, clientY));
  };

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    ref.current?.setAttribute("data-glow", "on");
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.removeAttribute("data-glow");
    el.style.setProperty("--glow-border", "0");
    el.style.setProperty("--glow-outer", "0");
  };

  const mesh = meshGradient(colors);

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cx("border-glow relative isolate", className)}
      style={
        {
          borderRadius: radius,
          "--glow-mesh": mesh,
          "--glow-radius": `${glowRadius}px`,
          "--glow-cone-a": `${coneSpread}%`,
          "--glow-cone-b": `${coneSpread + 15}%`,
          "--glow-cone-c": `${100 - coneSpread - 15}%`,
          "--glow-cone-d": `${100 - coneSpread}%`,
          "--glow-fill": fillOpacity,
        } as CSSProperties
      }
    >
      {children}
      <span aria-hidden className="border-glow-layer border-glow-ring" />
      <span aria-hidden className="border-glow-layer border-glow-fill" />
      <span aria-hidden className="border-glow-layer border-glow-bloom">
        <span style={{ boxShadow: bloomShadow(glowColor, glowIntensity) }} />
      </span>
    </div>
  );
}
