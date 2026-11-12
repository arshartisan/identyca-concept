import { RiArrowDownSLine, RiListUnordered } from "@remixicon/react";
import type { Heading } from "@/components/insights/markdown";

/** Collapsible section index for small screens (the desktop rail is sticky). */
export function LegalMobileNav({ headings, label = "Sections" }: { headings: Heading[]; label?: string }) {
  if (!headings.length) return null;
  return (
    <details className="group mb-12 rounded-2xl border border-border-hairline bg-background-elevated lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-body-medium text-text-primary [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <RiListUnordered aria-hidden className="size-4 text-text-tertiary" />
          {label}
        </span>
        <RiArrowDownSLine aria-hidden className="size-4 text-text-tertiary transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <ol className="flex flex-col gap-0.5 border-t border-border-hairline px-5 py-4">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="block py-1.5 text-body-regular text-text-secondary transition-colors duration-150 hover:text-text-primary">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
