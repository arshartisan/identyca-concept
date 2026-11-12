"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { useRef } from "react";
import { RiArrowRightLine, RiShieldCheckLine } from "@remixicon/react";
import { Container } from "@/components/site/section";
import { Cta } from "@/components/site/cta";
import { EASE, SplitWords } from "@/components/site/motion";
import { DEMO_HREF } from "@/lib/site";
import { ArViewfinder } from "./ar-viewfinder";

export function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[820px] opacity-80" />
      <div aria-hidden className="absolute -top-48 start-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-signal-glow opacity-40 blur-[140px]" />

      <Container className="relative">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <motion.a
            href="/spaces"
            {...fade(0)}
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border-hairline bg-background-elevated/70 py-1 ps-1 pe-3 text-caption-1-medium text-text-secondary backdrop-blur transition-colors duration-150 hover:border-border-hairline-strong hover:text-text-primary"
          >
            <span className="rounded-full bg-signal px-2 py-0.5 text-caption-2-semibold text-text-white">New</span>
            Identyca Spaces<span className="max-sm:hidden"> — the permanent venue layer</span>
            <RiArrowRightLine className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </motion.a>

          <h1 className="text-hero text-balance text-text-primary">
            <SplitWords text="See who matters at every stage of the event lifecycle." accent={[2]} />
          </h1>

          <motion.p {...fade(0.45)} className="text-lead mt-7 max-w-2xl text-pretty text-text-secondary">
            Identyca builds AI + AR intelligence for the conference industry — from the planning table to the event
            floor to the venue itself.
          </motion.p>

          <motion.div {...fade(0.55)} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine}>
              Book a demo
            </Cta>
            <Cta href="/roi-calculator" variant="secondary">
              Calculate your ROI
            </Cta>
          </motion.div>

          <motion.p {...fade(0.65)} className="mt-6 inline-flex items-center gap-1.5 text-caption-1-medium text-text-tertiary">
            <RiShieldCheckLine className="size-4" aria-hidden />
            Zero facial recognition. Identity is opt-in, via smart badge.
          </motion.p>
        </div>

        <motion.div style={{ scale, y }} className="relative mx-auto mt-16 max-w-[1100px] origin-top sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
          >
            <div aria-hidden className="absolute -inset-x-10 -bottom-10 top-1/3 rounded-full bg-signal-glow opacity-30 blur-[90px]" />
            <ArViewfinder className="relative" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
