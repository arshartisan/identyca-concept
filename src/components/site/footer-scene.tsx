"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";

/**
 * Isometric footer scene: the event lifecycle as an infinity track, with the
 * Identyca hardware around it (beacons, smart badge, venue hub, insights,
 * wayfinding) wired in by circuit traces.
 *
 * Everything is computed in a flat "plane" and projected to screen space with
 * a 30° isometric projection, so objects can be placed by plane coordinates.
 * Motion: lane markings flow, two cubes ride the loop (SMIL), pulses travel the
 * traces, beacons ping. Paused off-screen; still under reduced motion.
 */

const VW = 1100;
const VH = 470;
const OX = 550;
const OY = 226;
const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;

type P = [number, number];
const isoL = (x: number, y: number, z = 0): P => [(x - y) * C30, (x + y) * S30 - z];
const iso = (x: number, y: number, z = 0): P => {
  const [a, b] = isoL(x, y, z);
  return [OX + a, OY + b];
};
const f = (n: number) => n.toFixed(1);
const pts = (list: P[]) => list.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const planePath = (list: [number, number][], z = 0) =>
  "M" + list.map(([x, y]) => iso(x, y, z).map(f).join(" ")).join(" L");

/* ------------------------------------------------------------ The loop */

const A = 215;
function lemniscate(t0: number, t1: number, n: number, z = 0) {
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    const d = 1 + Math.sin(t) ** 2;
    const [x, y] = iso((A * Math.cos(t)) / d, (A * Math.sin(t) * Math.cos(t)) / d, z);
    out.push(`${i ? "L" : "M"}${f(x)} ${f(y)}`);
  }
  return out.join(" ");
}
const LOOP = lemniscate(0, Math.PI * 2, 180) + " Z";
// The strand that passes "over" at the crossing
const OVER = lemniscate(Math.PI / 2 - 0.42, Math.PI / 2 + 0.42, 30);
const SIDE_LAYERS = [14, 12, 10, 8, 6, 4, 2];

function Track({ d, gap = false }: { d: string; gap?: boolean }) {
  return (
    <g>
      {gap ? <path d={d} stroke="var(--color-background-full)" strokeOpacity={0.55} strokeWidth={40} strokeLinecap="butt" transform="translate(0 7)" /> : null}
      {SIDE_LAYERS.map((k) => (
        <path key={k} d={d} transform={`translate(0 ${k})`} stroke={k > 8 ? "#04526c" : "#026a8c"} strokeWidth={36} strokeLinecap="round" />
      ))}
      <path d={d} stroke="url(#scene-track)" strokeWidth={36} strokeLinecap="round" />
      <path d={d} stroke="#7ed6fd" strokeOpacity={0.28} strokeWidth={20} strokeLinecap="round" />
      <path d={d} className="scene-lane" stroke="#edf9ff" strokeOpacity={0.6} strokeWidth={2.4} strokeDasharray="14 12" strokeLinecap="round" />
    </g>
  );
}

/* --------------------------------------------------------- Primitives */

const FACE = { top: "#2a2b30", left: "#1d1e22", right: "#15161a", edge: "rgb(255 255 255 / 0.07)" };

function Box({
  x,
  y,
  w,
  d,
  h,
  z = 0,
  top = FACE.top,
  left = FACE.left,
  right = FACE.right,
  local = false,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  top?: string;
  left?: string;
  right?: string;
  local?: boolean;
}) {
  const p = local ? isoL : iso;
  return (
    <g stroke={FACE.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={pts([p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)])} fill={left} />
      <polygon points={pts([p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)])} fill={right} />
      <polygon points={pts([p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)])} fill={top} />
    </g>
  );
}

/** Upright cylinder (beacon puck / disk). */
function Puck({ x, y, r, h, z = 0, ping = false, led = "#00b8f0", delay = 0 }: { x: number; y: number; r: number; h: number; z?: number; ping?: boolean; led?: string; delay?: number }) {
  const [cx, cb] = iso(x, y, z);
  const ct = cb - h;
  const rx = r * 1.2247;
  const ry = r * 0.7071;
  return (
    <g>
      <path d={`M${f(cx - rx)} ${f(cb)} L${f(cx - rx)} ${f(ct)} L${f(cx + rx)} ${f(ct)} L${f(cx + rx)} ${f(cb)} A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cb)} Z`} fill={FACE.left} stroke={FACE.edge} />
      <ellipse cx={cx} cy={ct} rx={rx} ry={ry} fill={FACE.top} stroke={FACE.edge} />
      <ellipse cx={cx} cy={ct} rx={rx * 0.45} ry={ry * 0.45} fill={led} />
      {ping ? (
        <ellipse
          cx={cx}
          cy={ct}
          rx={rx * 0.6}
          ry={ry * 0.6}
          fill="none"
          stroke={led}
          strokeWidth={1.5}
          className="animate-pulse-ring [transform-box:fill-box] [transform-origin:center]"
          style={{ animationDuration: "2.8s", animationDelay: `${delay}s` }}
        />
      ) : null}
    </g>
  );
}

function Label({ x, y, z = 0, dx = 0, dy = 0, children }: { x: number; y: number; z?: number; dx?: number; dy?: number; children: string }) {
  const [sx, sy] = iso(x, y, z);
  return (
    <text x={sx + dx} y={sy + dy} className="fill-text-secondary font-mono max-sm:hidden" fontSize={11} letterSpacing="0.08em" textAnchor="start">
      {children.toUpperCase()}
    </text>
  );
}

/* ------------------------------------------------------------- Objects */

function HubBox({ x, y }: { x: number; y: number }) {
  const w = 64;
  const dots: P[] = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) dots.push(iso(x + 8 + i * 12, y + 8 + j * 12, 34));
  return (
    <g>
      <Box x={x} y={y} w={w} d={w} h={14} />
      <Box x={x} y={y} w={w} d={w} h={18} z={16} />
      {dots.map(([dx, dy], i) => (
        <circle key={i} cx={dx} cy={dy} r={1.7} fill="#edf9ff" opacity={0.55} className="scene-led" style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
    </g>
  );
}

function InsightBars({ x, y }: { x: number; y: number }) {
  const heights = [26, 40, 34, 56, 74];
  return (
    <g>
      {heights.map((h, i) => (
        <Box key={i} x={x + i * 18} y={y} w={10} d={56} h={h} top={i === heights.length - 1 ? "#00b8f0" : FACE.top} right={i === heights.length - 1 ? "#0286b0" : FACE.right} />
      ))}
    </g>
  );
}

function Badge({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Box x={x} y={y} w={64} d={44} h={6} />
      <polygon points={pts([iso(x + 6, y + 6, 6), iso(x + 58, y + 6, 6), iso(x + 58, y + 14, 6), iso(x + 6, y + 14, 6)])} fill="#00b8f0" />
      <polygon points={pts([iso(x + 6, y + 22, 6), iso(x + 36, y + 22, 6), iso(x + 36, y + 26, 6), iso(x + 6, y + 26, 6)])} fill="rgb(255 255 255 / 0.25)" />
      <polygon points={pts([iso(x + 6, y + 30, 6), iso(x + 28, y + 30, 6), iso(x + 28, y + 34, 6), iso(x + 6, y + 34, 6)])} fill="rgb(255 255 255 / 0.15)" />
    </g>
  );
}

function SensorTile({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[
        [0, 0],
        [24, 0],
        [0, 24],
        [24, 24],
      ].map(([dx, dy]) => (
        <Box key={`${dx}-${dy}`} x={x + dx} y={y + dy} w={21} d={21} h={7} top={dx === 24 && dy === 0 ? "#f88000" : FACE.top} right={dx === 24 && dy === 0 ? "#b85f07" : FACE.right} />
      ))}
    </g>
  );
}

function WayfindingPin({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y, 30);
  return (
    <g>
      <Puck x={x} y={y} r={26} h={8} led={FACE.top} />
      <Puck x={x} y={y} r={22} h={8} z={10} led={FACE.top} />
      <Puck x={x} y={y} r={18} h={8} z={20} led="#10a6d9" />
      <g className="animate-float" style={{ animationDuration: "4s" }}>
        <path d={`M${f(px)} ${f(py - 4)} C${f(px - 14)} ${f(py - 20)} ${f(px - 14)} ${f(py - 40)} ${f(px)} ${f(py - 40)} C${f(px + 14)} ${f(py - 40)} ${f(px + 14)} ${f(py - 20)} ${f(px)} ${f(py - 4)} Z`} fill="#f88000" />
        <circle cx={px} cy={py - 28} r={4.5} fill="#fff5ee" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------- Traces */

const TRACES: { d: string; dur: number; delay: number; tone?: "warm" }[] = [
  { d: planePath([[-218, 0], [-300, 0], [-300, 52]]), dur: 3.4, delay: 0 },
  { d: planePath([[-205, -40], [-205, -60], [-276, -60]]), dur: 3.8, delay: -1.2 },
  { d: planePath([[96, -66], [96, -160], [24, -160], [24, -174]]), dur: 4.4, delay: -2.4 },
  { d: planePath([[218, 0], [270, 0], [270, -58], [300, -58]]), dur: 3.6, delay: -0.6, tone: "warm" },
  { d: planePath([[340, -90], [340, -150], [350, -150]]), dur: 3.2, delay: -1.8 },
  { d: planePath([[150, 70], [150, 214], [112, 214]]), dur: 4, delay: -3 },
  { d: planePath([[84, 214], [-10, 214], [-10, 262]]), dur: 3.6, delay: -0.9 },
  { d: planePath([[96, -160], [150, -160], [150, -244]]), dur: 3.9, delay: -2, tone: "warm" },
];

const BACKDROP = [
  planePath([[-560, 300], [520, 300]]),
  planePath([[-560, -320], [520, -320]]),
  planePath([[420, -520], [420, 520]]),
  planePath([[-430, -520], [-430, 520]]),
  planePath([[-560, 120], [-380, 120], [-380, 380]]),
  planePath([[300, -520], [300, -330], [520, -330]]),
];

/* ---------------------------------------------------------------- Scene */

export function FooterScene({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      svg.pauseAnimations();
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      wrap.classList.toggle("bento-paused", !e.isIntersecting);
      if (e.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={cx("bento-visual relative w-full", className)}>
      <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="block h-auto w-full overflow-hidden [mask-image:radial-gradient(ellipse_80%_92%_at_50%_50%,black_66%,transparent)]" fill="none">
        <defs>
          <linearGradient id="scene-track" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7ed6fd" />
            <stop offset="45%" stopColor="#00b8f0" />
            <stop offset="100%" stopColor="#10a6d9" />
          </linearGradient>
          <radialGradient id="scene-glow">
            <stop offset="0%" stopColor="#00b8f0" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#00b8f0" stopOpacity={0} />
          </radialGradient>
          <filter id="scene-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Backdrop traces and glow */}
        {BACKDROP.map((d) => (
          <path key={d} d={d} stroke="rgb(255 255 255 / 0.05)" strokeWidth={1} />
        ))}
        <ellipse cx={OX} cy={OY + 20} rx={360} ry={170} fill="url(#scene-glow)" />

        {/* Wiring */}
        {TRACES.map((t) => (
          <g key={t.d}>
            <path d={t.d} stroke="rgb(255 255 255 / 0.12)" strokeWidth={1.25} />
            <path
              d={t.d}
              pathLength={100}
              className={cx("bento-trace", t.tone === "warm" ? "stroke-warm" : "stroke-signal")}
              strokeWidth={2}
              strokeLinecap="round"
              style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
            />
          </g>
        ))}

        {/* Objects behind the loop (smaller screen y first) */}
        <InsightBars x={-20} y={-230} />
        <Label x={62} y={-230} dx={16} dy={-30}>Insights</Label>
        <Puck x={-300} y={-60} r={20} h={12} ping delay={0.4} />
        <Label x={-300} y={-60} dx={34} dy={-4}>Beacon</Label>
        <WayfindingPin x={150} y={-268} />
        <Label x={150} y={-268} dx={40} dy={-24}>Wayfinding</Label>
        <SensorTile x={350} y={-180} />
        <Badge x={-336} y={44} />
        <Label x={-306} y={66} dx={-40} dy={34}>Smart badge</Label>

        {/* Glass plate + the track */}
        <path d={LOOP} transform="translate(0 26)" stroke="#00b8f0" strokeOpacity={0.12} strokeWidth={72} strokeLinecap="round" filter="url(#scene-blur)" />
        <path d={LOOP} transform="translate(0 20)" stroke="rgb(255 255 255 / 0.04)" strokeWidth={62} strokeLinecap="round" />
        <Track d={LOOP} />
        <Track d={OVER} gap />

        {/* Riders */}
        <g>
          <Box x={-10} y={-10} w={20} d={20} h={20} z={4} local top="#fed2b6" left="#f88000" right="#e57600" />
          <animateMotion dur="11s" repeatCount="indefinite" path={LOOP} />
        </g>
        <g>
          <Box x={-9} y={-9} w={18} d={18} h={18} z={4} local top="#edf9ff" left="#7ed6fd" right="#00b8f0" />
          <animateMotion dur="11s" begin="-5.5s" repeatCount="indefinite" path={LOOP} />
        </g>

        {/* Objects in front of the loop */}
        <HubBox x={300} y={-90} />
        <Label x={364} y={-26} dx={12} dy={8}>Venue hub</Label>
        <Puck x={98} y={214} r={18} h={12} ping delay={1.4} led="#f88000" />
        <Label x={98} y={214} dx={28} dy={8}>AR node</Label>
        <Puck x={-10} y={276} r={14} h={8} ping delay={2.2} />
      </svg>
    </div>
  );
}
