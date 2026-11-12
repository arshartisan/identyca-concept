import Image from "next/image";
import type { ReactNode } from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { RiArrowRightLine } from "@remixicon/react";
import { cx } from "@/utils/cx";
import { DEMO_HREF } from "@/lib/site";
import { Accent, Card, Container, Eyebrow, Section } from "./section";
import { Cta } from "./cta";
import { Reveal, Stagger, StaggerItem, CountUp } from "./motion";

/* ----------------------------------------------------------------- PageHero */

/**
 * Interior page hero: eyebrow, big headline (pass <Accent> for serif words),
 * lead, CTAs, optional visual underneath. Graph-paper backdrop fades out.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  children,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section className={cx("relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28", className)}>
      <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[640px] opacity-70" />
      <div aria-hidden className="absolute -top-40 start-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-signal-glow opacity-40 blur-[120px]" />
      <Container className="relative">
        <div className={cx("flex flex-col gap-6", align === "center" ? "mx-auto max-w-4xl items-center text-center" : "max-w-4xl")}>
          {eyebrow ? (
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
          ) : null}
          <Reveal delay={0.05}>
            <h1 className="text-hero text-balance text-text-primary">{title}</h1>
          </Reveal>
          {lead ? (
            <Reveal delay={0.12}>
              <p className="text-lead max-w-2xl text-pretty text-text-secondary">{lead}</p>
            </Reveal>
          ) : null}
          {actions ? (
            <Reveal delay={0.18} className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </Reveal>
          ) : null}
        </div>
        {children ? <Reveal delay={0.25} className="mt-16 sm:mt-20">{children}</Reveal> : null}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------- FeatureGrid */

export type Feature = { title: string; body: ReactNode; icon?: RemixiconComponentType; meta?: ReactNode };

/** Hairline grid of features (Stripe-style cells sharing borders). */
export function FeatureGrid({ items, columns = 3, className }: { items: Feature[]; columns?: 2 | 3 | 4; className?: string }) {
  return (
    <Stagger
      className={cx(
        "grid overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline gap-px",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((f) => (
        <StaggerItem key={f.title} className="group relative flex flex-col gap-3 bg-background-elevated p-6 sm:p-8">
          {f.icon ? (
            <span className="mb-2 flex size-10 items-center justify-center rounded-xl border border-border-hairline bg-background-full text-foreground-icon-primary transition-colors duration-150 group-hover:text-signal">
              <f.icon className="size-5" aria-hidden />
            </span>
          ) : null}
          <h3 className="text-title-3-semibold tracking-[-0.02em] text-text-primary">{f.title}</h3>
          <p className="text-body-regular leading-6 text-text-secondary">{f.body}</p>
          {f.meta ? <div className="mt-auto pt-3">{f.meta}</div> : null}
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ------------------------------------------------------------- StatCallout */

/** Small mono stat line used under problem cards. */
export function StatNote({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-start gap-2 rounded-xl bg-warm-soft px-3 py-2 text-caption-1-medium text-text-primary">
      <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-warm" />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- StatGrid */

export type Stat = { value: number; decimals?: number; prefix?: string; suffix?: string; label: ReactNode };

export function StatGrid({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <Stagger className={cx("grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline lg:grid-cols-4", className)}>
      {stats.map((s, i) => (
        <StaggerItem key={i} className="flex flex-col gap-3 bg-background-elevated p-6 sm:p-8">
          <span className="text-stat text-text-primary">
            <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
          </span>
          <span className="text-body-regular text-text-secondary">{s.label}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ------------------------------------------------------------ BrowserFrame */

/** Product screenshot in a minimal app-window frame. */
export function BrowserFrame({
  src,
  alt,
  label,
  className,
  priority,
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cx(
        "overflow-hidden rounded-2xl border border-border-hairline-strong bg-background-elevated",
        "shadow-[0_30px_80px_-30px_rgb(0_0_0/0.25)]",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-border-hairline bg-background-sunken px-3.5">
        <span className="size-2.5 rounded-full bg-border-hairline-strong" />
        <span className="size-2.5 rounded-full bg-border-hairline-strong" />
        <span className="size-2.5 rounded-full bg-border-hairline-strong" />
        {label ? <span className="ms-3 truncate text-caption-1-medium text-text-tertiary">{label}</span> : null}
      </div>
      <Image src={src} alt={alt} width={1024} height={540} priority={priority} className="h-auto w-full" sizes="(min-width: 1024px) 600px, 100vw" />
    </figure>
  );
}

/* --------------------------------------------------------------- CtaBand */

export function CtaBand({
  title = (
    <>
      See who matters at your <Accent>next event</Accent>.
    </>
  ),
  lead = "Book a 30-minute walkthrough. We'll model your event, your sponsors and your numbers.",
  primary = { label: "Book a demo", href: DEMO_HREF },
  secondary = { label: "Calculate your ROI", href: "/roi-calculator" },
}: {
  title?: ReactNode;
  lead?: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
}) {
  return (
    <Section className="pt-8 sm:pt-8">
      <Container>
        <Reveal>
          <div className="dark relative isolate overflow-hidden rounded-[32px] bg-background-full px-6 py-16 text-center sm:px-16 sm:py-24">
            <div aria-hidden className="bg-grid mask-radial absolute inset-0 opacity-60" />
            <div aria-hidden className="absolute -bottom-40 start-1/2 h-80 w-[680px] -translate-x-1/2 rounded-full bg-signal-glow blur-[100px]" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-section text-balance text-text-primary">{title}</h2>
              <p className="text-lead text-text-secondary">{lead}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Cta href={primary.href} trailingIcon={RiArrowRightLine}>
                  {primary.label}
                </Cta>
                {secondary ? (
                  <Cta href={secondary.href} variant="secondary">
                    {secondary.label}
                  </Cta>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------------- Steps */

export function Steps({ steps, className }: { steps: { title: string; body: ReactNode }[]; className?: string }) {
  return (
    <Stagger as="ul" className={cx("grid gap-4 md:grid-cols-3", className)}>
      {steps.map((s, i) => (
        <StaggerItem as="li" key={s.title}>
          <Card className="flex h-full flex-col gap-4 p-6 sm:p-8">
            <span className="font-mono text-caption-1-medium text-signal">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-title-2-semibold tracking-[-0.02em] text-text-primary">{s.title}</h3>
            <p className="text-body-regular leading-6 text-text-secondary">{s.body}</p>
          </Card>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ---------------------------------------------------------- Bullet list */

export function CheckList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cx("flex flex-col gap-3", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-body-regular leading-6 text-text-secondary">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
