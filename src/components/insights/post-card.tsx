import Link from "next/link";
import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiArrowRightLine,
  RiGroupLine,
  RiLineChartLine,
  RiMapPin2Line,
  RiSparkling2Line,
  RiArticleLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import { BorderGlow } from "@/components/foundations/border-glow/border-glow";
import type { PostSummary } from "@/lib/posts";

const CATEGORY_ICON: Record<string, RemixiconComponentType> = {
  Networking: RiGroupLine,
  "Sponsor ROI": RiLineChartLine,
  "Event Technology": RiMapPin2Line,
  "Event Intelligence": RiSparkling2Line,
};

/** Typographic cover: graph paper, a soft signal glow and concentric rings. */
export function PostCover({
  category,
  index,
  size = "md",
  className,
}: {
  category: string;
  index: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const Icon = CATEGORY_ICON[category] ?? RiArticleLine;
  return (
    <div
      aria-hidden
      className={cx(
        "relative isolate overflow-hidden rounded-2xl border border-border-hairline bg-background-sunken",
        size === "lg" ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[420px]" : "aspect-[16/10]",
        className,
      )}
    >
      <div className="bg-grid mask-radial absolute inset-0 opacity-80" />
      <div className="absolute start-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-glow opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="absolute size-[46%] max-h-64 max-w-64 rounded-full border border-border-hairline" />
        <span className="absolute size-[30%] max-h-44 max-w-44 rounded-full border border-border-hairline-strong" />
        <span
          className={cx(
            "relative flex items-center justify-center rounded-2xl border border-border-hairline bg-background-elevated text-signal",
            "shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)] transition-transform duration-500 ease-out-soft group-hover:-translate-y-1",
            size === "lg" ? "size-16" : "size-12",
          )}
        >
          <Icon className={size === "lg" ? "size-7" : "size-5"} />
        </span>
      </div>
      <span className="eyebrow absolute start-4 bottom-4 text-text-tertiary sm:start-5 sm:bottom-5">
        Insights · {String(index).padStart(2, "0")}
      </span>
    </div>
  );
}

export function PostMeta({ post, className }: { post: Pick<PostSummary, "category" | "date" | "dateLabel" | "readingMinutes">; className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-body-medium text-text-tertiary", className)}>
      <span className="text-signal">{post.category}</span>
      <span aria-hidden className="size-1 rounded-full bg-border-hairline-strong" />
      <time dateTime={post.date}>{post.dateLabel}</time>
      <span aria-hidden className="size-1 rounded-full bg-border-hairline-strong" />
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}

function ReadMore() {
  return (
    <span className="inline-flex items-center gap-1.5 text-body-medium text-text-primary">
      Read article
      <RiArrowRightLine aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
    </span>
  );
}

export function PostCard({ post, index }: { post: PostSummary; index: number }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group flex h-full flex-col gap-5 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <PostCover category={post.category} index={index} />
      <div className="flex flex-1 flex-col gap-3 px-1">
        <PostMeta post={post} />
        <h3 className="text-title-1-semibold tracking-[-0.02em] text-balance text-text-primary transition-colors duration-150 group-hover:text-signal">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-body-regular leading-6 text-text-secondary">{post.excerpt}</p>
        <div className="mt-auto pt-2">
          <ReadMore />
        </div>
      </div>
    </Link>
  );
}

export function FeaturedPost({ post, index }: { post: PostSummary; index: number }) {
  return (
    <BorderGlow radius={28}>
    <Link
      href={`/insights/${post.slug}`}
      className={cx(
        "group grid gap-8 rounded-[28px] border border-border-hairline bg-background-elevated p-3 sm:p-4 lg:grid-cols-[1.1fr_1fr] lg:gap-12",
        "shadow-[0_1px_0_0_rgb(0_0_0/0.02),0_12px_32px_-16px_rgb(0_0_0/0.08)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
      )}
    >
      <PostCover category={post.category} index={index} size="lg" />
      <div className="flex flex-col gap-5 px-3 pb-5 sm:px-4 lg:justify-center lg:py-10 lg:pe-10">
        <span className="eyebrow inline-flex items-center gap-2 text-text-secondary">
          <span aria-hidden className="size-1.5 rounded-full bg-signal" />
          Latest
        </span>
        <h2 className="text-subsection text-balance text-text-primary transition-colors duration-150 group-hover:text-signal">
          {post.title}
        </h2>
        <p className="text-lead text-pretty text-text-secondary">{post.excerpt}</p>
        <PostMeta post={post} />
        <div className="pt-2">
          <ReadMore />
        </div>
      </div>
    </Link>
    </BorderGlow>
  );
}
