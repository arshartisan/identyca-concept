import { POST_SOURCES, type PostSource } from "@/content/posts";
import { countWords, getHeadings, parseMarkdown, type Block, type Heading } from "@/components/insights/markdown";

export type Post = PostSource & {
  blocks: Block[];
  headings: Heading[];
  readingMinutes: number;
};

export type PostSummary = Omit<Post, "body" | "blocks" | "headings">;

const WORDS_PER_MINUTE = 230;

/** Parsed once at module load — content is static. Newest first. */
const POSTS: Post[] = POST_SOURCES.map((p) => {
  const blocks = parseMarkdown(p.body);
  return {
    ...p,
    blocks,
    headings: getHeadings(blocks),
    readingMinutes: Math.max(1, Math.ceil(countWords(p.body) / WORDS_PER_MINUTE)),
  };
});

export function getAllPosts(): Post[] {
  return POSTS;
}

export function getPostSummaries(): PostSummary[] {
  return POSTS.map(({ slug, title, description, category, date, dateLabel, excerpt, cta, readingMinutes }) => ({
    slug,
    title,
    description,
    category,
    date,
    dateLabel,
    excerpt,
    cta,
    readingMinutes,
  }));
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** `newer` / `older` neighbours in the newest-first list. */
export function getAdjacentPosts(slug: string): { newer?: Post; older?: Post } {
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { newer: POSTS[i - 1], older: POSTS[i + 1] };
}

export function getCategories(): string[] {
  return Array.from(new Set(POSTS.map((p) => p.category)));
}
