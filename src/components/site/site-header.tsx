"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { RiArrowDownSLine, RiArrowRightLine, RiArrowRightUpLine, RiMenu4Line } from "@remixicon/react";
import { cx } from "@/utils/cx";
import { COMPANY, DEMO_HREF, LOGINS, PRODUCTS, ROI_LINK } from "@/lib/site";
import { SOLUTION_LINKS } from "@/lib/solutions-index";
import { Logo } from "./logo";
import { Cta } from "./cta";
import { EASE } from "./motion";

type MenuKey = "products" | "solutions" | "company" | "login";

const loadSidebar = () => import("./mobile-sidebar").then((m) => m.MobileSidebar);
const MobileSidebar = dynamic(loadSidebar, { ssr: false });

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // The sidebar chunk is requested on first intent (touch/hover/focus) and mounted on first open.
  const [sidebarWanted, setSidebarWanted] = useState(false);
  const openSidebar = () => {
    setSidebarWanted(true);
    setMobileOpen(true);
  };
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
            onClick={openSidebar}
            onPointerEnter={() => void loadSidebar()}
            onFocus={() => void loadSidebar()}
            onTouchStart={() => void loadSidebar()}
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

      {/* Loaded on first use: keeps the drawer + React Aria dialog stack out of the initial bundle */}
      {sidebarWanted ? <MobileSidebar isOpen={mobileOpen} onOpenChange={setMobileOpen} /> : null}
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
