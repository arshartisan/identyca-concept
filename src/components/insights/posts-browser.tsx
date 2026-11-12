"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import type { PostSummary } from "@/lib/posts";
import { FeaturedPost, PostCard } from "./post-card";

const ALL = "All";

/** Insights index: category filter chips, featured latest post, grid of the rest. */
export function PostsBrowser({ posts, categories }: { posts: PostSummary[]; categories: string[] }) {
  const [category, setCategory] = useState(ALL);
  const numberOf = (slug: string) => posts.length - posts.findIndex((p) => p.slug === slug);

  const featured = category === ALL ? posts[0] : undefined;
  const rest = category === ALL ? posts.slice(1) : posts.filter((p) => p.category === category);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <Reveal>
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...categories].map((c) => {
            const active = c === category;
            const count = c === ALL ? posts.length : posts.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={cx(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-body-medium transition-colors duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  active
                    ? "border-transparent bg-signal-soft text-signal"
                    : "border-border-hairline bg-background-elevated text-text-secondary hover:border-border-hairline-strong hover:text-text-primary",
                )}
              >
                {c}
                <span className={cx("font-mono text-caption-1-medium tabular-nums", active ? "text-signal" : "text-text-tertiary")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div key={category} className="flex flex-col gap-16 sm:gap-20">
        {featured ? (
          <Reveal>
            <FeaturedPost post={featured} index={numberOf(featured.slug)} />
          </Reveal>
        ) : null}

        {rest.length ? (
          <Stagger className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <StaggerItem key={p.slug} className="h-full">
                <PostCard post={p} index={numberOf(p.slug)} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </div>
    </div>
  );
}
