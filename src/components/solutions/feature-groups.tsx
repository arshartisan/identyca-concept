import Link from "next/link";
import { RiArrowRightUpLine } from "@remixicon/react";
import type { Solution, SolutionFeature, SolutionGroup } from "@/content/solutions";
import { BrowserFrame, FeatureGrid } from "@/components/site/blocks";
import { Container, Section } from "@/components/site/section";
import { Reveal } from "@/components/site/motion";
import { cx } from "@/utils/cx";
import { PRODUCT_META, ProductChip } from "./products";

type PreparedGroup = {
  group: SolutionGroup;
  /** Rows with a screenshot not yet shown on this page. */
  visual: (SolutionFeature & { image: string; n: number })[];
  /** Rows whose screenshot already appeared — rendered as text cards. */
  text: SolutionFeature[];
};

/** Splits rows so each screenshot appears at most once per page. */
function prepare(groups: SolutionGroup[]): PreparedGroup[] {
  const seen = new Set<string>();
  return groups.map((group) => {
    const visual: PreparedGroup["visual"] = [];
    const text: SolutionFeature[] = [];
    for (const f of group.features) {
      if (f.image && !seen.has(f.image)) {
        seen.add(f.image);
        visual.push({ ...f, image: f.image, n: visual.length + 1 });
      } else {
        text.push(f);
      }
    }
    return { group, visual, text };
  });
}

export function SolutionFeatureGroups({ solution }: { solution: Solution }) {
  const prepared = prepare(solution.groups);
  return (
    <>
      {prepared.map((p, gi) => (
        <FeatureGroup key={p.group.product} prepared={p} tone={gi % 2 === 1 ? "sunken" : "paper"} />
      ))}
    </>
  );
}

function FeatureGroup({ prepared, tone }: { prepared: PreparedGroup; tone: "paper" | "sunken" }) {
  const { group, visual, text } = prepared;
  const meta = PRODUCT_META[group.product];
  const count = group.features.length;

  return (
    <Section id={meta.id} tone={tone} className="border-t border-border-hairline">
      <Container>
        {/* Group header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-5">
            <Reveal className="flex flex-wrap items-center gap-3">
              <ProductChip product={group.product} />
              <span className="eyebrow text-text-tertiary">
                {count} {count === 1 ? "capability" : "capabilities"}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-section text-balance text-text-primary">{meta.tagline}</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link
              href={meta.href}
              className={cx(
                "group/link inline-flex items-center gap-1 rounded-md text-body-medium text-text-secondary",
                "transition-colors duration-150 hover:text-text-primary",
                "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              About {meta.name}
              <RiArrowRightUpLine
                className="size-4 transition-transform duration-200 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Reveal>
        </div>

        {/* Screenshot rows */}
        {visual.length ? (
          <ol className="mt-16 flex flex-col sm:mt-20">
            {visual.map((f, i) => (
              <FeatureRow key={f.title} feature={f} flip={i % 2 === 1} frameLabel={meta.frameLabel} productName={meta.name} />
            ))}
          </ol>
        ) : null}

        {/* Rows whose screenshot already appeared */}
        {text.length ? (
          <div className="mt-16 flex flex-col gap-6 sm:mt-20">
            <Reveal>
              <h3 className="eyebrow text-text-tertiary">Also in {meta.short}</h3>
            </Reveal>
            <FeatureGrid
              columns={text.length % 2 === 0 && text.length % 3 !== 0 ? 2 : 3}
              className={cx(text.length === 1 && "sm:grid-cols-1 lg:grid-cols-1 sm:max-w-xl")}
              items={text.map((f) => ({ title: f.title, body: f.body }))}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

function FeatureRow({
  feature,
  flip,
  frameLabel,
  productName,
}: {
  feature: SolutionFeature & { image: string; n: number };
  flip: boolean;
  frameLabel: string;
  productName: string;
}) {
  return (
    <li className="grid items-start gap-8 border-t border-border-hairline py-12 first:border-t-0 first:pt-0 sm:py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
      <Reveal
        className={cx(
          "flex flex-col gap-4 lg:sticky lg:top-32 lg:col-span-5 lg:pt-6",
          flip ? "lg:order-2" : "lg:order-1",
        )}
      >
        <span className="font-mono text-caption-1-medium text-signal">{String(feature.n).padStart(2, "0")}</span>
        <h3 className="text-subsection text-balance text-text-primary">{feature.title}</h3>
        <p className="text-lead text-pretty text-text-secondary">{feature.body}</p>
      </Reveal>
      <Reveal delay={0.08} className={cx("lg:col-span-7", flip ? "lg:order-1" : "lg:order-2")}>
        <BrowserFrame src={feature.image} alt={`${feature.title} in ${productName}`} label={frameLabel} />
      </Reveal>
    </li>
  );
}
