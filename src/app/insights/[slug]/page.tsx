import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { Accent, Container, Eyebrow } from "@/components/site/section";
import { CtaBand } from "@/components/site/blocks";
import { Reveal } from "@/components/site/motion";
import { Prose } from "@/components/insights/markdown";
import { TableOfContents } from "@/components/insights/toc";
import { LegalMobileNav } from "@/components/legal/legal-mobile-nav";
import { PostMeta } from "@/components/insights/post-card";
import { getAdjacentPosts, getAllPosts, getPost, type Post } from "@/lib/posts";
import { cx } from "@/utils/cx";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      section: post.category,
    },
  };
}

// The params read lives inside <Suspense> so the route's App Shell stays URL-independent
// (Next 16 instant navigation); every slug is still prerendered via generateStaticParams.
export default function Page({ params }: PageProps<"/insights/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: PageProps<"/insights/[slug]">["params"] }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { newer, older } = getAdjacentPosts(post.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    articleSection: post.category,
    publisher: { "@type": "Organization", name: "Identyca" },
    mainEntityOfPage: `https://www.identyca.io/insights/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        {/* Header */}
        <header className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
          <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[520px] opacity-60" />
          <div aria-hidden className="absolute -top-48 start-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-signal-glow opacity-30 blur-[120px]" />
          <Container className="relative">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
              <Reveal>
                <Link
                  href="/insights"
                  className="group inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors duration-150 hover:text-text-primary"
                >
                  <RiArrowLeftLine aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
                  Back to Insights
                </Link>
              </Reveal>
              <Reveal delay={0.04}>
                <Eyebrow>{post.category}</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="text-section text-balance text-text-primary">
                  <span className="font-serif font-normal tracking-[-0.025em]">{post.title}</span>
                </h1>
              </Reveal>
              <Reveal delay={0.14}>
                <PostMeta post={post} className="justify-center" />
              </Reveal>
            </div>
          </Container>
        </header>

        {/* Body */}
        <Container>
          <div className="border-t border-border-hairline pt-12 sm:pt-16 lg:grid lg:grid-cols-[200px_minmax(0,680px)_200px] lg:justify-between lg:gap-10">
            <aside className="hidden lg:block">
              <TableOfContents headings={post.headings} className="sticky top-28" />
            </aside>

            <div className="mx-auto w-full max-w-[680px]">
              <LegalMobileNav headings={post.headings} label="On this page" />
              <Prose blocks={post.blocks} />

              <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border-hairline pt-8">
                <span className="text-body-medium text-text-tertiary">
                  Filed under <span className="text-text-primary">{post.category}</span>
                </span>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-1.5 text-body-medium text-text-primary underline decoration-border-hairline-strong underline-offset-4 transition-colors duration-150 hover:decoration-signal"
                >
                  More Insights
                </Link>
              </footer>
            </div>

            <div aria-hidden className="hidden lg:block" />
          </div>
        </Container>
      </article>

      {/* Prev / next */}
      {newer || older ? (
        <section className="pt-20 sm:pt-28">
          <Container>
            <nav aria-label="More articles" className="grid gap-px overflow-hidden rounded-3xl border border-border-hairline bg-border-hairline sm:grid-cols-2">
              <AdjacentLink post={older} direction="prev" />
              <AdjacentLink post={newer} direction="next" />
            </nav>
          </Container>
        </section>
      ) : null}

      {post.cta ? (
        <CtaBand
          title={<CtaTitle text={post.cta.title} />}
          lead={post.cta.lead}
          primary={post.cta.primary}
          secondary={post.cta.secondary}
        />
      ) : (
        <CtaBand />
      )}
    </>
  );
}

/** Puts the final word of a CTA headline in the serif accent. */
function CtaTitle({ text }: { text: string }) {
  const m = /^(.*\s)(\S+?)([?.!]?)$/.exec(text);
  if (!m) return <>{text}</>;
  return (
    <>
      {m[1]}
      <Accent>{m[2]}</Accent>
      {m[3]}
    </>
  );
}

function AdjacentLink({ post, direction }: { post?: Post; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  if (!post) {
    return <div aria-hidden className="hidden bg-background-elevated sm:block" />;
  }
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cx(
        "group flex flex-col gap-3 bg-background-elevated p-6 transition-colors duration-150 hover:bg-background-sunken sm:p-8",
        "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
        isNext && "sm:items-end sm:text-end",
      )}
    >
      <span className="eyebrow inline-flex items-center gap-1.5 text-text-tertiary">
        {isNext ? null : <RiArrowLeftLine aria-hidden className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />}
        {isNext ? "Newer" : "Older"}
        {isNext ? <RiArrowRightLine aria-hidden className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" /> : null}
      </span>
      <span className="text-title-2-semibold tracking-[-0.02em] text-balance text-text-primary">{post.title}</span>
      <span className="text-body-medium text-text-tertiary">
        {post.category} · {post.dateLabel}
      </span>
    </Link>
  );
}
