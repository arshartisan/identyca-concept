import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/**
 * A deliberately tiny markdown subset for long-form copy (blog posts, legal):
 *   ## heading · paragraphs · "- " lists · "> " quotes (a "> - " line is the
 *   attribution) · "---" rules · inline **bold**, *italic*, [text](href).
 * Pure functions + server-rendered output; no runtime dependency.
 */

export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "hr" };

export type Heading = { id: string; text: string };

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

export function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  const seen = new Map<string, number>();
  let para: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join("\n") });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flush();
      const text = trimmed.slice(3).trim();
      let id = slugify(text) || "section";
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      if (n) id = `${id}-${n + 1}`;
      blocks.push({ type: "h2", id, text });
      continue;
    }
    if (trimmed === "---") {
      flush();
      blocks.push({ type: "hr" });
      continue;
    }
    if (trimmed.startsWith("- ")) {
      flush();
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      i--;
      blocks.push({ type: "ul", items });
      continue;
    }
    if (trimmed.startsWith(">")) {
      flush();
      const body: string[] = [];
      let cite: string | undefined;
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        const content = lines[i].trim().replace(/^>\s?/, "");
        if (/^[--]\s/.test(content)) cite = content.replace(/^[--]\s/, "");
        else body.push(content);
        i++;
      }
      i--;
      blocks.push({ type: "quote", text: body.join(" "), cite });
      continue;
    }
    para.push(trimmed);
  }
  flush();
  return blocks;
}

export function getHeadings(blocks: Block[]): Heading[] {
  return blocks.flatMap((b) => (b.type === "h2" ? [{ id: b.id, text: b.text }] : []));
}

export function countWords(md: string) {
  return md
    .replace(/[#>*[\]()_-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/* ------------------------------------------------------------------ inline */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

const linkClass =
  "text-text-primary underline decoration-signal/50 decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-signal";

export function Inline({ text }: { text: string }): ReactNode {
  const parts = text.split(INLINE).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-text-primary">
          <Inline text={part.slice(2, -2)} />
        </strong>
      );
    }
    if (part.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (m) {
        const [, label, href] = m;
        return /^(https?:|mailto:|tel:)/.test(href) ? (
          <a key={i} href={href} className={linkClass}>
            {label}
          </a>
        ) : (
          <Link key={i} href={href} className={linkClass}>
            {label}
          </Link>
        );
      }
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          <Inline text={part.slice(1, -1)} />
        </em>
      );
    }
    // Hard line breaks inside a paragraph (e.g. postal-style contact blocks).
    const lines = part.split("\n");
    return lines.map((l, j) => (
      <span key={`${i}-${j}`}>
        {j > 0 ? <br /> : null}
        {l}
      </span>
    ));
  });
}

/* ------------------------------------------------------------------- prose */

type Variant = "article" | "legal";

const styles = {
  article: {
    root: "min-w-0",
    h2: "mt-16 mb-5 scroll-mt-28 text-subsection text-balance text-text-primary first:mt-0",
    p: "mt-6 first:mt-0 text-lead leading-[1.75] text-pretty text-text-primary/80",
    lede: "text-title-2-regular leading-[1.6] text-pretty text-text-primary sm:text-title-1-regular sm:leading-[1.55]",
    ul: "mt-6 flex flex-col gap-3.5",
    li: "flex gap-4 text-lead leading-[1.7] text-text-primary/80",
    dot: "mt-[0.72em] size-1.5 shrink-0 rounded-full bg-signal",
  },
  legal: {
    root: "min-w-0",
    h2: "mt-16 mb-5 scroll-mt-28 border-t border-border-hairline pt-10 text-title-1-semibold tracking-[-0.02em] text-text-primary first:mt-0 first:border-t-0 first:pt-0",
    p: "mt-5 first:mt-0 text-headline-regular leading-[1.8] text-pretty text-text-primary/80",
    lede: "",
    ul: "mt-5 flex flex-col gap-3",
    li: "flex gap-4 text-headline-regular leading-[1.75] text-text-primary/80",
    dot: "mt-[0.7em] size-1.5 shrink-0 rounded-full bg-signal",
  },
} as const;

export function Prose({
  blocks,
  variant = "article",
  className,
  numbered = false,
}: {
  blocks: Block[];
  variant?: Variant;
  className?: string;
  /** Legal docs: split "1. Title" headings into a mono number + title. */
  numbered?: boolean;
}) {
  const s = styles[variant];
  const firstParagraph = variant === "article" ? blocks.findIndex((b) => b.type === "p") : -1;

  return (
    <div className={cx(s.root, className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2": {
            const m = numbered ? /^(\d+)\.\s*(.*)$/.exec(b.text) : null;
            return (
              <h2 key={i} id={b.id} className={s.h2}>
                {m ? (
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-body-medium text-signal tabular-nums">
                      {m[1].padStart(2, "0")}
                    </span>
                    <span>{m[2]}</span>
                  </span>
                ) : (
                  <Inline text={b.text} />
                )}
              </h2>
            );
          }
          case "p":
            return (
              <p key={i} className={i === firstParagraph ? s.lede : s.p}>
                <Inline text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className={s.ul}>
                {b.items.map((item, j) => (
                  <li key={j} className={s.li}>
                    <span aria-hidden className={s.dot} />
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <figure key={i} className="my-10 border-s-2 border-signal ps-6 sm:my-12 sm:ps-8">
                <blockquote className="text-title-1-regular leading-[1.35] text-balance text-text-primary sm:text-display-4-regular sm:leading-[1.25]">
                  <span className="font-accent">
                    <Inline text={b.text} />
                  </span>
                </blockquote>
                {b.cite ? (
                  <figcaption className="eyebrow mt-4 text-text-tertiary">- {b.cite}</figcaption>
                ) : null}
              </figure>
            );
          case "hr":
            return (
              <div key={i} aria-hidden className="my-12 flex items-center justify-center gap-3">
                <span className="size-1 rounded-full bg-border-hairline-strong" />
                <span className="size-1 rounded-full bg-border-hairline-strong" />
                <span className="size-1 rounded-full bg-border-hairline-strong" />
              </div>
            );
        }
      })}
    </div>
  );
}
