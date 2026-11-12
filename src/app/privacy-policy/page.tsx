import type { Metadata } from "next";
import { RiMailLine, RiShieldCheckLine } from "@remixicon/react";
import { Container } from "@/components/site/section";
import { PageHero } from "@/components/site/blocks";
import { Prose } from "@/components/insights/markdown";
import { TableOfContents } from "@/components/insights/toc";
import { LegalMobileNav } from "@/components/legal/legal-mobile-nav";
import { getPrivacyPolicy, PRIVACY_EMAIL } from "@/components/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Identyca Pte. Ltd. - how we collect, use, store, share, and protect your personal data on the Identyca platform.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const { blocks, headings } = getPrivacyPolicy();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead={
          <>
            Identyca Pte. Ltd. <span aria-hidden className="mx-2 text-text-tertiary">|</span> Last Updated: July 2026
          </>
        }
        className="pb-12 sm:pb-16"
      />

      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="border-t border-border-hairline pt-12 sm:pt-16 lg:grid lg:grid-cols-[240px_minmax(0,720px)] lg:justify-between lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-10">
                <TableOfContents headings={headings} label="Sections" />
                <PrivacyContactCard />
              </div>
            </aside>

            <div className="w-full max-w-[720px]">
              <LegalMobileNav headings={headings} />
              <Prose blocks={blocks} variant="legal" numbered />
              <div className="mt-16 lg:hidden">
                <PrivacyContactCard />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function PrivacyContactCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-hairline bg-background-elevated p-5">
      <span className="flex size-9 items-center justify-center rounded-xl border border-border-hairline bg-background-full text-signal">
        <RiShieldCheckLine aria-hidden className="size-[18px]" />
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-headline-semibold text-text-primary">Data Privacy Office</span>
        <span className="text-body-regular leading-5 text-text-secondary">
          Questions or requests about your personal data? We respond within 30 days.
        </span>
      </div>
      <a
        href={`mailto:${PRIVACY_EMAIL}`}
        className="inline-flex items-center gap-2 text-body-medium text-signal underline decoration-signal/40 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
      >
        <RiMailLine aria-hidden className="size-4" />
        {PRIVACY_EMAIL}
      </a>
    </div>
  );
}
