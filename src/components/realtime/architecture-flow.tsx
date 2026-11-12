"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { Fragment } from "react";
import { RiCpuLine, RiDashboard3Line, RiIdCardLine } from "@remixicon/react";
import { Stagger, StaggerItem } from "@/components/site/motion";

const NODES = [
  { icon: RiIdCardLine, title: "Smart badge", sub: "Positioning sensors" },
  { icon: RiCpuLine, title: "Edge engine", sub: "Real-time processing" },
  { icon: RiDashboard3Line, title: "Organizer dashboard", sub: "Insights & ROI" },
];
const EDGES = ["Spatial signal", "Analytics"];

/** Badge → Edge → Dashboard, with packets travelling along each link. */
export function ArchitectureFlow() {
  const reduce = useReducedMotion();
  return (
    <Stagger className="flex flex-col items-stretch gap-0 lg:flex-row lg:items-center" gap={0.12}>
      {NODES.map((n, i) => (
        <Fragment key={n.title}>
          <StaggerItem className="flex-1">
            <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-background-elevated p-4 lg:flex-col lg:items-start lg:gap-4 lg:p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-signal-soft text-signal">
                <n.icon className="size-5" aria-hidden />
              </span>
              <span className="flex flex-col">
                <span className="text-headline-semibold text-text-primary">{n.title}</span>
                <span className="text-body-regular text-text-secondary">{n.sub}</span>
              </span>
            </div>
          </StaggerItem>
          {i < EDGES.length ? (
            <div className="relative flex h-14 items-center justify-center lg:h-auto lg:w-24 lg:flex-col" aria-hidden>
              {/* rail */}
              <span className="absolute inset-y-0 start-[38px] w-px bg-border-hairline-strong lg:inset-x-0 lg:inset-y-auto lg:top-1/2 lg:h-px lg:w-auto" />
              {/* packet */}
              {!reduce ? (
                <>
                  <motion.span
                    className="absolute start-[35px] size-[7px] rounded-full bg-signal shadow-[0_0_12px_var(--color-signal)] lg:hidden"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
                  />
                  <motion.span
                    className="absolute top-1/2 hidden size-[7px] -translate-y-1/2 rounded-full bg-signal shadow-[0_0_12px_var(--color-signal)] lg:block"
                    initial={{ left: "0%" }}
                    animate={{ left: ["0%", "92%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
                  />
                </>
              ) : null}
              <span className="relative ms-16 rounded-full border border-border-hairline bg-background-full px-2 py-0.5 text-caption-2-medium whitespace-nowrap text-text-tertiary lg:ms-0 lg:-translate-y-5">
                {EDGES[i]}
              </span>
            </div>
          ) : null}
        </Fragment>
      ))}
    </Stagger>
  );
}
