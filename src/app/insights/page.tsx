import type { Metadata } from "next";
import { Accent, Container } from "@/components/site/section";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { PostsBrowser } from "@/components/insights/posts-browser";
import { getCategories, getPostSummaries } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Insights & Updates",
  description:
    "Thinking on the future of conference networking, event technology, and the business of meaningful connections.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const posts = getPostSummaries();
  const categories = getCategories();

  return (
    <>
      <PageHero
        eyebrow="Insights & Updates"
        title={
          <>
            Latest from <Accent>Identyca</Accent>
          </>
        }
        lead="Thinking on the future of conference networking, event technology, and the business of meaningful connections."
        className="pb-12 sm:pb-16"
      />
      <section className="pb-24 sm:pb-32">
        <Container>
          <PostsBrowser posts={posts} categories={categories} />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
