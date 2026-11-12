"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/utils/cx";

/**
 * Isometric hero scene: two venue platforms (event floor + venue) wired into a
 * glowing Identyca pedestal, with floating "live matches" and "event lifecycle"
 * screens. Everything is placed in a flat plane and projected at 30°.
 * Loops pause off-screen and stop under reduced motion (`bento-visual`).
 */

const C = 0.8660254037844386;
const OX = 600;
const OY = 236;
type Pt = [number, number];
const P = (x: number, y: number, z = 0): Pt => [OX + (x - y) * C, OY + (x + y) * 0.5 - z];
const pts = (l: Pt[]) => l.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");
const path = (l: [number, number][], z = 0) => "M" + l.map(([x, y]) => P(x, y, z).map((n) => n.toFixed(1)).join(" ")).join(" L");

const STROKE = "#3a3a41";
const CYAN = "var(--color-signal)";

type BoxProps = { x: number; y: number; z?: number; w: number; d: number; h: number; top?: string; left?: string; right?: string };

function Box({ x, y, z = 0, w, d, h, top = "#2a2a30", left = "#1c1c20", right = "#151518" }: BoxProps) {
  return (
    <g stroke={STROKE} strokeWidth={1} strokeLinejoin="round">
      <polygon points={pts([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)])} fill={left} />
      <polygon points={pts([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)])} fill={right} />
      <polygon points={pts([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)])} fill={top} />
    </g>
  );
}

/** Wayfinding marker: translucent cyan pyramid, floating. */
function Pyramid({ x, y, z, s = 34, h = 70, delay = 0 }: { x: number; y: number; z: number; s?: number; h?: number; delay?: number }) {
  const apex = P(x + s / 2, y + s / 2, z + h);
  return (
    <g className="iso-float" style={{ animationDelay: `${delay}s` }}>
      <polygon points={pts([P(x, y + s, z), P(x + s, y + s, z), apex])} fill={CYAN} fillOpacity={0.22} stroke={CYAN} strokeWidth={1.2} />
      <polygon points={pts([P(x + s, y, z), P(x + s, y + s, z), apex])} fill={CYAN} fillOpacity={0.4} stroke={CYAN} strokeWidth={1.2} />
      <line x1={apex[0]} y1={apex[1]} x2={P(x + s, y + s, z)[0]} y2={P(x + s, y + s, z)[1]} stroke={CYAN} strokeWidth={1.2} />
    </g>
  );
}

/** Attendee orb. */
function Orb({ x, y, z, r = 9, accent = false }: { x: number; y: number; z: number; r?: number; accent?: boolean }) {
  const [cx_, cy_] = P(x, y, z + r);
  return (
    <g>
      <ellipse cx={P(x, y, z)[0]} cy={P(x, y, z)[1]} rx={r * 1.1} ry={r * 0.55} fill="#0e0e10" opacity={0.6} />
      <circle cx={cx_} cy={cy_} r={r} fill={accent ? "var(--color-warm)" : "#cfcfd6"} stroke="#0a0a0b" strokeWidth={1} />
      <circle cx={cx_ - r * 0.35} cy={cy_ - r * 0.35} r={r * 0.3} fill="#ffffff" opacity={0.55} />
    </g>
  );
}

/** Beacon puck with a ping. */
function Beacon({ x, y, z, delay = 0 }: { x: number; y: number; z: number; delay?: number }) {
  const [bx, by] = P(x, y, z);
  return (
    <g>
      <ellipse cx={bx} cy={by - 5} rx={16} ry={8} fill="none" stroke={CYAN} strokeWidth={1.2} className="animate-pulse-ring [transform-box:fill-box] [transform-origin:center]" style={{ animationDuration: "2.8s", animationDelay: `${delay}s` }} />
      <path d={`M${bx - 10} ${by} v-5 a10 5 0 0 1 20 0 v5 a10 5 0 0 1 -20 0z`} fill="#26262b" stroke={STROKE} />
      <ellipse cx={bx} cy={by - 5} rx={4} ry={2} fill={CYAN} />
    </g>
  );
}

/** Steps rising along +x. */
function Stairs({ x, y, z, n = 3, w = 22, d = 60, rise = 12 }: { x: number; y: number; z: number; n?: number; w?: number; d?: number; rise?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} x={x + i * w} y={y} z={z} w={w} d={d} h={rise * (i + 1)} />
      ))}
    </g>
  );
}

/** Flat tile grid on a platform top. */
function Tiles({ x0, x1, y0, y1, z, step = 60 }: { x0: number; x1: number; y0: number; y1: number; z: number; step?: number }) {
  const lines: string[] = [];
  for (let x = x0 + step; x < x1; x += step) lines.push(path([[x, y0], [x, y1]], z));
  for (let y = y0 + step; y < y1; y += step) lines.push(path([[x0, y], [x1, y]], z));
  return (
    <g stroke="#2c2c33" strokeWidth={1}>
      {lines.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/* --------------------------------------------------------------- screens */

const MATCHES = [
  { id: "SC", pct: 94 },
  { id: "MW", pct: 87 },
  { id: "PN", pct: 79 },
  { id: "AK", pct: 72 },
];

/** "Live matches" leaderboard on a panel facing front-right (u along +x). */
function MatchesScreen() {
  return (
    <g transform="matrix(0.866 0.5 0 1 286 92)">
      <g className="iso-float" style={{ animationDelay: "-1.5s" }}>
      <rect x={0} y={0} width={232} height={170} rx={10} fill="#111114" stroke={CYAN} strokeWidth={1.5} />
      <text x={14} y={24} className="font-mono" fontSize={10} letterSpacing="0.14em" fill="#9a9a9a">LIVE MATCHES</text>
      <circle cx={214} cy={20} r={4} fill="#34d399" className="scene-led" />
      {MATCHES.map((m, i) => (
        <g key={m.id} transform={`translate(12 ${38 + i * 31})`}>
          <rect x={0} y={0} width={208} height={24} rx={6} fill="#1d1d22" />
          <rect x={0} y={0} width={208} height={24} rx={6} fill={CYAN} className="iso-row" style={{ animationDelay: `${i * 1.1}s` }} />
          <rect x={4} y={4} width={26} height={16} rx={4} fill={i === 0 ? CYAN : "#2e2e35"} />
          <text x={17} y={15.5} textAnchor="middle" fontSize={8} fontWeight={700} fill={i === 0 ? "#0a0a0b" : "#d4d4d8"}>
            {m.id}
          </text>
          <rect x={38} y={10} width={(m.pct / 100) * 120} height={4} rx={2} fill="#4a4a52" />
          <text x={198} y={15.5} textAnchor="end" className="font-mono" fontSize={9} fill="#e4e4e7">
            {m.pct}%
          </text>
        </g>
      ))}
      </g>
    </g>
  );
}

/** "Event lifecycle" flow on a panel facing front-left (u along -y). */
function LifecycleScreen() {
  const nodes = ["PLAN", "EVENT", "VENUE"];
  return (
    <g transform="matrix(0.866 -0.5 0 1 682 208)">
      <g className="iso-float" style={{ animationDelay: "-3s" }}>
      <rect x={0} y={0} width={232} height={170} rx={10} fill="#111114" stroke={CYAN} strokeWidth={1.5} />
      <text x={14} y={24} className="font-mono" fontSize={10} letterSpacing="0.14em" fill="#9a9a9a">EVENT LIFECYCLE</text>
      {nodes.map((n, i) => {
        const y = 44 + i * 38;
        return (
          <g key={n}>
            <rect x={14} y={y} width={70} height={24} rx={6} fill="#1d1d22" stroke="#3a3a41" />
            <text x={49} y={y + 15.5} textAnchor="middle" className="font-mono" fontSize={8.5} letterSpacing="0.1em" fill="#d4d4d8">
              {n}
            </text>
            <path d={`M84 ${y + 12} H120 V${102} H150`} fill="none" stroke="#4a4a52" strokeWidth={1.5} />
            <path d={`M84 ${y + 12} H120 V${102} H150`} fill="none" stroke={CYAN} strokeWidth={2} pathLength={100} className="bento-trace" style={{ animationDelay: `${-i * 0.9}s`, animationDuration: "2.7s" }} />
          </g>
        );
      })}
      <rect x={150} y={84} width={66} height={36} rx={8} fill={CYAN} fillOpacity={0.16} stroke={CYAN} />
      <text x={183} y={106} textAnchor="middle" className="font-mono" fontSize={11} fontWeight={700} letterSpacing="0.1em" fill={CYAN}>
        ROI
      </text>
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- scene */

export function HeroScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("bento-paused", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const H = 22; // platform height
  const [logoX, logoY] = P(0, 0, 86);

  return (
    <div ref={ref} aria-hidden className={cx("bento-visual relative w-full overflow-hidden", className)}>
      <svg
        viewBox="0 0 1200 540"
        preserveAspectRatio="xMidYMid slice"
        className="block aspect-[4/3] w-full [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] sm:aspect-[20/9]"
        fill="none"
      >
        <defs>
          <linearGradient id="iso-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="var(--color-signal)" stopOpacity={0.55} />
            <stop offset="1" stopColor="var(--color-signal)" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="iso-floor-glow">
            <stop offset="0" stopColor="var(--color-signal)" stopOpacity={0.22} />
            <stop offset="1" stopColor="var(--color-signal)" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={OX} cy={OY + 70} rx={360} ry={150} fill="url(#iso-floor-glow)" />

        {/* ---------------- left platform: the event floor */}
        <Box x={-300} y={60} w={260} d={360} h={H} top="#1f1f24" left="#18181c" right="#131316" />
        <Tiles x0={-300} x1={-40} y0={60} y1={420} z={H} />
        <Box x={-286} y={78} z={H} w={84} d={92} h={58} />
        <polygon points={pts([P(-286, 170, H + 14), P(-230, 170, H + 14), P(-230, 170, H + 44), P(-286, 170, H + 44)])} fill={CYAN} fillOpacity={0.3} stroke={CYAN} />
        <Pyramid x={-110} y={86} z={H} delay={-0.6} />
        <Beacon x={-170} y={210} z={H} delay={0.3} />
        <Orb x={-230} y={240} z={H} />
        <Orb x={-150} y={290} z={H} accent />
        {/* badge-scan gate */}
        <Box x={-120} y={300} z={H} w={12} d={12} h={56} />
        <Box x={-120} y={360} z={H} w={12} d={12} h={56} />
        <Box x={-120} y={300} z={H + 56} w={12} d={72} h={10} top={CYAN} />
        <Stairs x={-250} y={330} z={H} />
        <Pyramid x={-280} y={380} z={H} s={28} h={58} delay={-2} />

        {/* ---------------- right platform: the venue */}
        <Box x={60} y={-300} w={360} d={260} h={H} top="#1f1f24" left="#18181c" right="#131316" />
        <Tiles x0={60} x1={420} y0={-300} y1={-40} z={H} />
        <Box x={318} y={-288} z={H} w={90} d={110} h={96} />
        {Array.from({ length: 12 }, (_, i) => {
          const [lx, ly] = P(330 + (i % 4) * 18, -178, H + 22 + Math.floor(i / 4) * 22);
          return <circle key={i} cx={lx} cy={ly} r={2.4} fill={CYAN} className="scene-led" style={{ animationDelay: `${(i % 5) * 0.35}s` }} />;
        })}
        <Pyramid x={96} y={-276} z={H} delay={-1.2} />
        <Orb x={190} y={-210} z={H} />
        <Orb x={250} y={-140} z={H} accent />
        <Beacon x={330} y={-110} z={H} delay={1.1} />
        <Stairs x={150} y={-110} z={H} />
        <Pyramid x={380} y={-96} z={H} s={28} h={58} delay={-2.6} />

        {/* ---------------- rails into the centre */}
        {[
          path([[-40, 160], [-40, 46]], 1),
          path([[160, -40], [46, -40]], 1),
        ].map((d) => (
          <g key={d}>
            <path d={d} stroke="#2a2a30" strokeWidth={16} strokeLinecap="round" />
            <path d={d} stroke={CYAN} strokeWidth={2.5} strokeLinecap="round" pathLength={100} className="bento-trace" style={{ animationDuration: "2.4s" }} />
          </g>
        ))}

        {/* ---------------- centre: the Identyca pedestal */}
        <Box x={-50} y={-50} w={100} d={100} h={64} top="#2f2f36" left="#202025" right="#18181c" />
        <Box x={-38} y={-38} z={64} w={76} d={76} h={14} top="#26262c" left="#1c1c21" right="#16161a" />
        <polygon points={pts([P(-30, -30, 78), P(30, -30, 78), P(30, 30, 78), P(-30, 30, 78)])} fill={CYAN} fillOpacity={0.35} stroke={CYAN} />
        <image
          href="/brand/identyca-logo.png"
          x={-26}
          y={-26}
          width={52}
          height={52}
          transform={`matrix(${C} 0.5 ${-C} 0.5 ${P(0, 0, 78)[0]} ${P(0, 0, 78)[1]})`}
        />
        <polygon
          points={pts([[logoX - 52, logoY + 22], [logoX + 52, logoY + 22], [logoX + 40, logoY - 150], [logoX - 40, logoY - 150]])}
          fill="url(#iso-beam)"
          className="iso-beam"
        />

        {/* ---------------- front: beacon hubs */}
        {[
          { x: 40, y: 150 },
          { x: 150, y: 40 },
        ].map((hub) => (
          <g key={`${hub.x}`}>
            <Box x={hub.x} y={hub.y} w={80} d={60} h={44} top="#2c2c32" />
            {[0, 1, 2].map((k) => {
              const a = P(hub.x + 14 + k * 14, hub.y + 60, 12);
              const b = P(hub.x + 14 + k * 14, hub.y + 60, 32);
              return <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#4a4a52" strokeWidth={2} />;
            })}
            <circle cx={P(hub.x + 70, hub.y + 30, 44)[0]} cy={P(hub.x + 70, hub.y + 30, 44)[1]} r={3} fill={CYAN} className="scene-led" />
          </g>
        ))}

        {/* ---------------- floating screens */}
        <MatchesScreen />
        <LifecycleScreen />
      </svg>
    </div>
  );
}
