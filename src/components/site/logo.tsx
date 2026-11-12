import { cx } from "@/utils/cx";

/** Isometric cube mark — a reduced take on the original Identyca cube. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cx("size-7", className)}>
      <rect width="32" height="32" rx="9" className="fill-text-primary" />
      <path
        d="M16 7.5 23.5 11.75v8.5L16 24.5l-7.5-4.25v-8.5L16 7.5Z"
        className="stroke-background-full"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.5 11.75 16 16l7.5-4.25M16 16v8.5" className="stroke-background-full" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="2.1" className="fill-signal" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-title-3-semibold tracking-[-0.03em] text-text-primary">identyca</span>
    </span>
  );
}
