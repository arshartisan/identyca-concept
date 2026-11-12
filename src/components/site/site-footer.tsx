import Link from "next/link";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { COMPANY, CONTACT_EMAIL, LOGINS, PRODUCTS, ROI_LINK } from "@/lib/site";
import { SOLUTION_LINKS } from "@/lib/solutions-index";
import { Container } from "./section";
import { Logo } from "./logo";

const linkCls =
  "text-body-regular text-text-secondary transition-colors duration-150 hover:text-text-primary rounded outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border-hairline">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-xs text-body-regular text-text-secondary">
            Networking intelligence for live events. See who matters. Connect instantly.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkCls}>
            {CONTACT_EMAIL}
          </a>
          <ThemeToggle appearance="segmented" size="small" className="w-fit" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <FooterCol title="Products">
            {PRODUCTS.map((p) => (
              <Link key={p.href} href={p.href} className={linkCls}>
                {p.title}
              </Link>
            ))}
            <Link href={ROI_LINK.href} className={linkCls}>
              ROI Calculator
            </Link>
          </FooterCol>
          <FooterCol title="Solutions">
            {SOLUTION_LINKS.slice(0, 6).map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className={linkCls}>
                {s.title}
              </Link>
            ))}
          </FooterCol>
          <FooterCol title="Company">
            {COMPANY.map((c) => (
              <Link key={c.href} href={c.href} className={linkCls}>
                {c.title}
              </Link>
            ))}
            <Link href="/problem" className={linkCls}>
              The Problem
            </Link>
          </FooterCol>
          <FooterCol title="Log in">
            {LOGINS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={linkCls}>
                {l.title}
              </a>
            ))}
            <Link href="/demo" className={linkCls}>
              Book a demo
            </Link>
          </FooterCol>
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-border-hairline py-6 text-caption-1-medium text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Identyca Pte. Ltd. All rights reserved.</span>
        <span>No facial recognition. Identity is opt-in, via badge only.</span>
      </Container>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.18em] text-center font-sans text-[clamp(4rem,19vw,17rem)] leading-none font-semibold tracking-[-0.07em] text-text-primary/[0.04]">
          identyca
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow text-text-tertiary">{title}</p>
      {children}
    </div>
  );
}
