import Link from "next/link";
import { SOLUTION_LINKS } from "@/lib/solutions-index";

/** "Built for" strip - stands in for a logo cloud, linking to each solution page. */
export function AudienceMarquee() {
  const items = [...SOLUTION_LINKS, ...SOLUTION_LINKS];
  return (
    <section aria-label="Who Identyca is built for" className="border-y border-border-hairline py-6">
      <div className="flex items-center gap-6">
        <p className="eyebrow hidden shrink-0 ps-8 text-text-tertiary md:block">Built for</p>
        <div className="mask-fade-x relative flex-1 overflow-hidden">
          <ul className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {items.map((s, i) => (
              <li key={`${s.slug}-${i}`} aria-hidden={i >= SOLUTION_LINKS.length}>
                <Link
                  href={`/solutions/${s.slug}`}
                  tabIndex={i >= SOLUTION_LINKS.length ? -1 : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-border-hairline px-4 py-2 text-body-medium whitespace-nowrap text-text-secondary transition-colors duration-150 hover:border-border-hairline-strong hover:text-text-primary"
                >
                  <span className="size-1 rounded-full bg-text-tertiary" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
