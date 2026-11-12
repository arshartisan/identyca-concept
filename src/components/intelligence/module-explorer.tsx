"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { Tab, TabList, TabPanel, Tabs, type Key } from "react-aria-components";
import { cx } from "@/utils/cx";
import { EASE } from "@/components/site/motion";

export type Module = { id: string; title: string; body: string; image: string };

const DURATION = 7000;

/** Auto-advancing feature explorer: module list + crossfading product screenshot. */
export function ModuleExplorer({ modules }: { modules: Module[] }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Key>(modules[0].id);
  const [paused, setPaused] = useState(false);
  const index = modules.findIndex((m) => m.id === selected);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => setSelected(modules[(index + 1) % modules.length].id), DURATION);
    return () => clearTimeout(t);
  }, [index, modules, paused, reduce]);

  const current = modules[index];

  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={setSelected}
      orientation="vertical"
      className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12"
    >
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <TabList aria-label="Organizer Intelligence modules" className="flex flex-col">
          {modules.map((m, i) => (
            <Tab
              key={m.id}
              id={m.id}
              className={({ isSelected, isFocusVisible }) =>
                cx(
                  "group relative cursor-pointer border-t border-border-hairline py-5 outline-none first:border-t-0 lg:py-6",
                  isFocusVisible && "ring-2 ring-border-focus-ring ring-inset rounded-xl",
                  isSelected ? "" : "opacity-60 hover:opacity-100 transition-opacity duration-150",
                )
              }
            >
              {({ isSelected }) => (
                <>
                  <div className="flex items-baseline gap-4">
                    <span className={cx("font-mono text-caption-1-medium", isSelected ? "text-signal" : "text-text-tertiary")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-title-3-semibold tracking-[-0.02em] text-text-primary">{m.title}</span>
                      <AnimatePresence initial={false}>
                        {isSelected ? (
                          <motion.p
                            initial={{ height: 0, opacity: 0, filter: "blur(2px)" }}
                            animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                            exit={{ height: 0, opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="overflow-hidden text-body-regular leading-6 text-text-secondary"
                          >
                            <span className="block pt-2">{m.body}</span>
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                  {isSelected ? (
                    <span aria-hidden className="absolute inset-x-0 -top-px h-px overflow-hidden">
                      <motion.span
                        key={`${m.id}-${paused}`}
                        className="block h-full origin-left bg-signal"
                        initial={{ scaleX: reduce || paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduce || paused ? 0 : DURATION / 1000, ease: "linear" }}
                      />
                    </span>
                  ) : null}
                </>
              )}
            </Tab>
          ))}
        </TabList>
      </div>

      <div className="relative lg:sticky lg:top-28 lg:self-start">
        {modules.map((m) => (
          <TabPanel key={m.id} id={m.id} className="outline-none" />
        ))}
        <div className="relative overflow-hidden rounded-2xl border border-border-hairline-strong bg-background-elevated shadow-[0_30px_80px_-30px_rgb(0_0_0/0.25)]">
          <div className="flex h-9 items-center gap-1.5 border-b border-border-hairline bg-background-sunken px-3.5">
            <span className="size-2.5 rounded-full bg-border-hairline-strong" />
            <span className="size-2.5 rounded-full bg-border-hairline-strong" />
            <span className="size-2.5 rounded-full bg-border-hairline-strong" />
            <span className="ms-3 text-caption-1-medium text-text-tertiary">intel.identyca.io · {current.title}</span>
          </div>
          <div className="relative aspect-[1024/540]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Image src={current.image} alt={`${current.title} screen in Identyca Event Intelligence`} fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
