"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RiArrowDownSLine, RiArrowRightLine, RiArrowRightUpLine, RiMenu4Line } from "@remixicon/react";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from "@/components/base/drawer/drawer";
import { cx } from "@/utils/cx";
import { COMPANY, DEMO_HREF, LOGINS, PRODUCTS, ROI_LINK } from "@/lib/site";
import { SOLUTION_LINKS } from "@/lib/solutions-index";
import { Logo } from "./logo";
import { Cta } from "./cta";
import { EASE } from "./motion";

type MenuKey = "products" | "solutions" | "company" | "login";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (adjust state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  const enter = (key: MenuKey) => {
    clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cx(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 rounded-full ps-4 pe-2 sm:ps-5",
          "border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
          scrolled || open
            ? "border-border-hairline bg-background-full/75 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.12)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
        onMouseLeave={leave}
      >
        <Link href="/" aria-label="Identyca home" className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          <NavTrigger label="Products" menu="products" open={open} onEnter={enter} />
          <NavTrigger label="Solutions" menu="solutions" open={open} onEnter={enter} />
          <NavLink href={ROI_LINK.href} active={pathname === ROI_LINK.href} onEnter={() => setOpen(null)}>
            ROI Calculator
          </NavLink>
          <NavLink href="/problem" active={pathname === "/problem"} onEnter={() => setOpen(null)}>
            The Problem
          </NavLink>
          <NavTrigger label="Company" menu="company" open={open} onEnter={enter} />
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <NavTrigger label="Log in" menu="login" open={open} onEnter={enter} />
          </div>
          <Cta href={DEMO_HREF} size="md" className="hidden sm:inline-flex">
            Book a demo
          </Cta>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground-icon-primary outline-none transition-colors duration-150 hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring lg:hidden"
          >
            <RiMenu4Line className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Desktop dropdown panel */}
      <div className="relative mx-auto hidden max-w-[1200px] lg:block" onMouseEnter={() => clearTimeout(closeTimer.current)} onMouseLeave={leave}>
        <AnimatePresence>
          {open ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -6, scale: 0.98, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.15, ease: "easeIn" } }}
              transition={{ duration: 0.25, ease: EASE }}
              className={cx(
                "absolute top-2 origin-top overflow-hidden rounded-3xl border border-border-hairline bg-background-elevated/95 p-2 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.25)] backdrop-blur-xl",
                open === "login" ? "end-2 w-80" : "start-1/2 w-[640px] -translate-x-1/2",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={open}
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 0.15 }}
                >
                  <MenuPanel menu={open} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <Drawer isOpen={mobileOpen} onOpenChange={setMobileOpen} placement="end" size="md" aria-label="Menu">
        <DrawerHeader title={<Logo />} />
        <DrawerBody>
          <MobileMenu onNavigate={() => setMobileOpen(false)} />
        </DrawerBody>
        <DrawerFooter className="flex-col! border-t border-border-hairline pt-4">
          <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine} className="w-full">
            Book a demo
          </Cta>
        </DrawerFooter>
      </Drawer>
    </header>
  );
}

function NavTrigger({
  label,
  menu,
  open,
  onEnter,
}: {
  label: string;
  menu: MenuKey;
  open: MenuKey | null;
  onEnter: (k: MenuKey) => void;
}) {
  const active = open === menu;
  return (
    <button
      type="button"
      aria-expanded={active}
      onMouseEnter={() => onEnter(menu)}
      onFocus={() => onEnter(menu)}
      onClick={() => onEnter(menu)}
      className={cx(
        "inline-flex h-9 items-center gap-0.5 rounded-full px-3 text-body-medium outline-none transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        active ? "bg-background-primary-hover text-text-primary" : "text-text-secondary hover:text-text-primary",
      )}
    >
      {label}
      <RiArrowDownSLine
        className={cx("size-4 transition-transform duration-200 ease-out", active && "rotate-180")}
        aria-hidden
      />
    </button>
  );
}

function NavLink({
  href,
  children,
  active,
  onEnter,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onEnter?: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      className={cx(
        "inline-flex h-9 items-center rounded-full px-3 text-body-medium outline-none transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
    </Link>
  );
}

function MenuRow({
  href,
  title,
  description,
  icon: Icon,
  external,
}: {
  href: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}) {
  const inner = (
    <>
      {Icon ? (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-hairline bg-background-full text-foreground-icon-primary transition-colors duration-150 group-hover/row:border-signal/30 group-hover/row:text-signal">
          <Icon className="size-5" />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center gap-1 text-headline-medium text-text-primary">
          {title}
          {external ? <RiArrowRightUpLine className="size-3.5 text-foreground-icon-tertiary" aria-hidden /> : null}
        </span>
        {description ? <span className="text-body-regular text-text-secondary">{description}</span> : null}
      </span>
    </>
  );
  const cls =
    "group/row flex items-center gap-3 rounded-2xl p-2.5 outline-none transition-colors duration-150 hover:bg-background-primary-hover focus-visible:bg-background-primary-hover";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function MenuPanel({ menu }: { menu: MenuKey }) {
  if (menu === "products") {
    return (
      <div className="grid grid-cols-[1fr_220px] gap-2">
        <div className="flex flex-col">
          {PRODUCTS.map((p) => (
            <MenuRow key={p.href} {...p} />
          ))}
        </div>
        <Link
          href={ROI_LINK.href}
          className="group/promo relative flex flex-col justify-end overflow-hidden rounded-2xl bg-background-sunken p-4 outline-none"
        >
          <div aria-hidden className="bg-grid mask-radial absolute inset-0 opacity-80" />
          <div aria-hidden className="absolute -top-10 -end-10 size-40 rounded-full bg-signal-glow blur-3xl" />
          <span className="relative eyebrow text-text-secondary">Tool</span>
          <span className="relative mt-1 text-title-3-semibold text-text-primary">Model your event ROI</span>
          <span className="relative mt-1 inline-flex items-center gap-1 text-body-medium text-signal">
            Open calculator
            <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover/promo:translate-x-0.5" />
          </span>
        </Link>
      </div>
    );
  }
  if (menu === "solutions") {
    return (
      <div className="p-2">
        <p className="eyebrow px-2 pb-2 text-text-tertiary">By organization type</p>
        <div className="grid grid-cols-2 gap-x-2">
          {SOLUTION_LINKS.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="group/row flex items-center justify-between rounded-xl px-2.5 py-2 text-body-medium text-text-secondary outline-none transition-colors duration-150 hover:bg-background-primary-hover hover:text-text-primary focus-visible:bg-background-primary-hover"
            >
              {s.title}
              <RiArrowRightLine className="size-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-150 group-hover/row:translate-x-0 group-hover/row:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    );
  }
  if (menu === "company") {
    return (
      <div className="grid grid-cols-2">
        {COMPANY.map((c) => (
          <MenuRow key={c.href} {...c} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {LOGINS.map((l) => (
        <MenuRow key={l.href} href={l.href} title={l.title} description={l.sub} external />
      ))}
    </div>
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
