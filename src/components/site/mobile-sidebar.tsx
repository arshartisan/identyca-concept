"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { RiArrowRightLine, RiArrowRightUpLine } from "@remixicon/react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from "@/components/base/drawer/drawer";
import { cx } from "@/utils/cx";
import { COMPANY, DEMO_HREF, LOGINS, PRODUCTS, ROI_LINK } from "@/lib/site";
import { SOLUTION_LINKS } from "@/lib/solutions-index";
import { Logo } from "./logo";
import { Cta } from "./cta";
import { EASE } from "./motion";

/**
 * Mobile navigation sidebar. Lives in its own module so SiteHeader can load it
 * with next/dynamic on first use: the drawer pulls in React Aria's modal/dialog
 * stack, which the rest of the home page does not need up front.
 */
export function MobileSidebar({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="end" size="md" aria-label="Menu">
      <DrawerHeader title={<Logo />} />
      <DrawerBody>
        <MobileMenu onNavigate={() => onOpenChange(false)} />
      </DrawerBody>
      <DrawerFooter className="flex-col! border-t border-border-hairline pt-4">
        <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine} className="w-full">
          Book a demo
        </Cta>
      </DrawerFooter>
    </Drawer>
  );
}

/* ------------------------------------------------------- Mobile sidebar */

function SidebarSection({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: EASE, delay: 0.08 + index * 0.06 }}
      className="flex flex-col gap-2"
    >
      <h2 className="eyebrow px-2 text-text-tertiary">{title}</h2>
      {children}
    </motion.section>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const row = (active: boolean) =>
    cx(
      "group relative flex items-center gap-3 rounded-2xl px-2 py-2 outline-none transition-colors duration-150",
      "hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
      active && "bg-signal-soft",
    );

  return (
    <div className="flex flex-col gap-7 pb-6">
      <SidebarSection title="Products" index={0}>
        <div className="flex flex-col gap-0.5">
          {PRODUCTS.map((p) => {
            const active = isActive(p.href);
            return (
              <Link key={p.href} href={p.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={row(active)}>
                {active ? <span aria-hidden className="absolute inset-y-3 -start-1 w-0.5 rounded-full bg-signal" /> : null}
                <span
                  className={cx(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-hairline bg-background-sunken transition-colors duration-150",
                    active ? "text-signal" : "text-foreground-icon-primary group-hover:text-signal",
                  )}
                >
                  <p.icon className="size-5" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-headline-medium text-text-primary">{p.title}</span>
                  <span className="truncate text-caption-1-regular text-text-tertiary">{p.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </SidebarSection>

      <SidebarSection title="Solutions" index={1}>
        <div className="flex flex-wrap gap-1.5 px-1">
          {SOLUTION_LINKS.slice(0, 6).map((sol) => {
            const href = `/solutions/${sol.slug}`;
            const active = isActive(href);
            return (
              <Link
                key={sol.slug}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-caption-1-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  active
                    ? "border-signal/50 bg-signal-soft text-text-primary"
                    : "border-border-hairline text-text-secondary hover:border-border-hairline-strong hover:text-text-primary",
                )}
              >
                {sol.title}
              </Link>
            );
          })}
          <Link
            href="/solutions"
            onClick={onNavigate}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-caption-1-medium text-signal outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            All {SOLUTION_LINKS.length}
            <RiArrowRightLine className="size-3.5" aria-hidden />
          </Link>
        </div>
      </SidebarSection>

      <SidebarSection title="Company" index={2}>
        <div className="grid grid-cols-2 gap-0.5">
          {COMPANY.map((c) => {
            const active = isActive(c.href);
            return (
              <Link key={c.href} href={c.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={row(active)}>
                <c.icon className={cx("size-[18px] shrink-0", active ? "text-signal" : "text-text-tertiary")} aria-hidden />
                <span className="text-body-medium text-text-primary">{c.title}</span>
              </Link>
            );
          })}
        </div>
      </SidebarSection>

      <SidebarSection title="Tools" index={3}>
        <div className="grid grid-cols-2 gap-0.5">
          <Link href={ROI_LINK.href} onClick={onNavigate} className={row(isActive(ROI_LINK.href))}>
            <ROI_LINK.icon className="size-[18px] shrink-0 text-warm" aria-hidden />
            <span className="text-body-medium text-text-primary">ROI Calculator</span>
          </Link>
          <Link href="/problem" onClick={onNavigate} className={row(isActive("/problem"))}>
            <RiArrowRightUpLine className="size-[18px] shrink-0 text-text-tertiary" aria-hidden />
            <span className="text-body-medium text-text-primary">The Problem</span>
          </Link>
        </div>
      </SidebarSection>

      <SidebarSection title="Log in" index={4}>
        <div className="flex flex-col gap-0.5">
          {LOGINS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={cx(row(false), "justify-between")}>
              <span className="flex min-w-0 flex-col">
                <span className="text-body-medium text-text-primary">{l.title}</span>
                <span className="truncate text-caption-1-regular text-text-tertiary">{l.sub}</span>
              </span>
              <RiArrowRightUpLine
                className="size-4 shrink-0 text-text-tertiary transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          ))}
        </div>
      </SidebarSection>
    </div>
  );
}
