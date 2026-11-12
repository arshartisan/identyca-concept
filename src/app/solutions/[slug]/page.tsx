import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RiArrowRightLine } from "@remixicon/react";
import { DEMO_HREF } from "@/lib/site";
import { SOLUTIONS, getSolution } from "@/content/solutions";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { Cta } from "@/components/site/cta";
import { Accent } from "@/components/site/section";
import { SolutionFeatureGroups } from "@/components/solutions/feature-groups";
import { GroupJumpLinks, OtherTypes } from "@/components/solutions/overview";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return {
    title: `For ${s.title}`,
    description: s.lead,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title: `Identyca for ${s.title}`, description: s.lead },
  };
}

// The params read lives inside <Suspense> so the route's App Shell stays URL-independent
// (Next 16 instant navigation); every slug is still prerendered via generateStaticParams.
export default function Page({ params }: PageProps<"/solutions/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <SolutionContent params={params} />
    </Suspense>
  );
}

async function SolutionContent({ params }: { params: PageProps<"/solutions/[slug]">["params"] }) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  const spacesOrIntelOnly = s.explore.href !== "/real-time";

  return (
    <>
      <PageHero
        eyebrow={`For ${s.eyebrow}`}
        title={
          <>
            {s.headline.pre}
            <Accent>{s.headline.accent}</Accent>
            {s.headline.post}
          </>
        }
        lead={s.lead}
        actions={
          <>
            <Cta href={DEMO_HREF} trailingIcon={RiArrowRightLine}>
              Book a demo
            </Cta>
            <Cta href={s.explore.href} variant="secondary">
              {s.explore.label}
            </Cta>
          </>
        }
      >
        <GroupJumpLinks solution={s} />
      </PageHero>

      <SolutionFeatureGroups solution={s} />

      <OtherTypes current={s.slug} />

      <CtaBand secondary={spacesOrIntelOnly ? s.explore : undefined} />
    </>
  );
}
