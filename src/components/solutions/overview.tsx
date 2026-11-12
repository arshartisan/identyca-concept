import Link from "next/link";
import { RiArrowDownLine, RiArrowRightLine } from "@remixicon/react";
import { SOLUTIONS, solutionHeadline, solutionProducts, type Solution } from "@/content/solutions";
import { Container, Section, SectionHeading } from "@/components/site/section";
import { Stagger, StaggerItem } from "@/components/site/motion";
import { cx } from "@/utils/cx";
import { PRODUCT_META, ProductChip } from "./products";

const linkFocus = "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring";

/** Hero jump-links: one cell per product group with its capability count. */
export function GroupJumpLinks({ solution }: { solution: Solution }) {
  return (
    <Stagger
      as="ul"
      className={cx(
        "grid gap-px overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline",
        solution.groups.length > 1 && "sm:grid-cols-2",
        solution.groups.length === 1 && "max-w-xl",
      )}
    >
      {solution.groups.map((g) => {
        const meta = PRODUCT_META[g.product];
        return (
          <StaggerItem as="li" key={g.product} className="bg-background-elevated">
            <a
              href={`#${meta.id}`}
              className={cx(
                "group flex h-full items-center justify-between gap-6 p-6 transition-colors duration-150 hover:bg-background-sunken sm:p-8",
                linkFocus,
              )}
            >
              <span className="flex flex-col gap-3">
                <ProductChip product={g.product} className="self-start" />
                <span className="text-title-3-semibold tracking-[-0.02em] text-text-primary">
                  {g.features.length} capabilities
                </span>
                <span className="text-body-regular text-text-secondary">{meta.name}</span>
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border-hairline text-foreground-icon-secondary transition-colors duration-150 group-hover:text-signal">
                <RiArrowDownLine className="size-5 transition-transform duration-200 ease-out group-hover:translate-y-0.5" aria-hidden />
              </span>
            </a>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/** Compact link strip to the other organization types. */
export function OtherTypes({ current }: { current: string }) {
  const others = SOLUTIONS.filter((s) => s.slug !== current);
  return (
    <Section className="pb-8 sm:pb-8">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="By organization type" title="Other organization types" />
        <Stagger
          as="ul"
          gap={0.04}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline sm:grid-cols-2 lg:grid-cols-5"
        >
          {others.map((s) => (
            <StaggerItem as="li" key={s.slug} className="bg-background-elevated">
              <Link
                href={`/solutions/${s.slug}`}
                className={cx(
                  "group flex h-full items-center justify-between gap-3 px-5 py-4 transition-colors duration-150 hover:bg-background-sunken lg:min-h-24 lg:items-start lg:px-6 lg:py-5",
                  linkFocus,
                )}
              >
                <span className="text-headline-medium text-text-primary">{s.title}</span>
                <RiArrowRightLine
                  className="size-4 shrink-0 text-foreground-icon-tertiary transition-[color,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-signal lg:mt-1"
                  aria-hidden
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/** Index grid of all organization types. */
export function SolutionsGrid() {
  return (
    <Stagger
      as="ul"
      gap={0.05}
      className="grid gap-px overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline sm:grid-cols-2 lg:grid-cols-3"
    >
      {SOLUTIONS.map((s, i) => (
        <StaggerItem as="li" key={s.slug} className="bg-background-elevated">
          <Link
            href={`/solutions/${s.slug}`}
            className={cx(
              "group flex h-full flex-col gap-4 p-6 transition-colors duration-150 hover:bg-background-sunken sm:p-8",
              linkFocus,
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-mono text-caption-1-medium text-text-tertiary">{String(i + 1).padStart(2, "0")}</span>
              <RiArrowRightLine
                className="size-5 text-foreground-icon-tertiary transition-[color,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-signal"
                aria-hidden
              />
            </span>
            <span className="text-title-3-semibold tracking-[-0.02em] text-text-primary">{s.title}</span>
            <span className="text-body-regular leading-6 text-text-secondary">{solutionHeadline(s)}</span>
            <span className="mt-auto flex flex-wrap gap-2 pt-2">
              {solutionProducts(s).map((p) => (
                <ProductChip key={p} product={p} />
              ))}
            </span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
