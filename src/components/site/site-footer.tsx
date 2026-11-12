import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { COMPANY, CONTACT_EMAIL, DEMO_HREF, LOGINS, PRODUCTS, ROI_LINK } from "@/lib/site";
import { SOLUTION_LINKS } from "@/lib/solutions-index";
import { Container } from "./section";
import { FooterScene } from "./footer-scene";
import { LogoMark } from "./logo";

const linkCls =
  "w-fit rounded text-headline-medium text-text-primary/85 outline-none transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const smallLinkCls =
  "rounded outline-none transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border-hairline">
      {/* Columns */}
      <Container className="grid grid-cols-2 gap-x-8 gap-y-12 pt-16 sm:grid-cols-3 sm:pt-20 lg:grid-cols-[1fr_1fr_1fr_1.7fr]">
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
          {SOLUTION_LINKS.slice(0, 4).map((s) => (
            <Link key={s.slug} href={`/solutions/${s.slug}`} className={linkCls}>
              {s.title}
            </Link>
          ))}
          <Link href="/solutions" className={linkCls}>
            All solutions
          </Link>
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

        <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-1">
          <p className="text-caption-1-medium text-text-tertiary">Talk to us</p>
          <p className="text-title-3-medium max-w-md text-text-primary">
            See who matters at your next event. We&apos;ll model the ROI with you.
          </p>
          <div className="flex items-center gap-2 rounded-full border border-border-hairline bg-background-elevated p-1.5 ps-5">
            <a href={`mailto:${CONTACT_EMAIL}`} className={`min-w-0 flex-1 truncate text-body-regular text-text-secondary ${smallLinkCls}`}>
              {CONTACT_EMAIL}
            </a>
            <Link
              href={DEMO_HREF}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-body-medium text-text-primary outline-none transition-colors duration-150 hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              Book a demo
              <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>

      {/* Scene */}
      <div className="relative mt-20 overflow-hidden sm:mt-28 lg:mt-32">
        <FooterScene className="mx-auto max-w-[1100px] px-2" />
      </div>

      {/* Bottom bar */}
      <Container className="mt-12 grid grid-cols-1 gap-3 border-t border-border-hairline py-8 text-caption-1-medium sm:mt-16 text-text-secondary sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
        <span className="inline-flex items-center gap-2 text-text-primary">
          <LogoMark className="size-5" />
          © 2026 Identyca Pte. Ltd.
        </span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 lg:justify-center">
          {LOGINS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={smallLinkCls}>
              {l.title} login
            </a>
          ))}
        </span>
        <span className="text-text-tertiary lg:text-center">No facial recognition. Identity is opt-in.</span>
        <Link href="/privacy-policy" className={`w-fit lg:justify-self-end ${smallLinkCls}`}>
          Privacy Policy
        </Link>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="mb-1 text-caption-1-medium text-text-tertiary">{title}</p>
      {children}
    </div>
  );
}
