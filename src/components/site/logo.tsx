import Image from "next/image";
import { cx } from "@/utils/cx";

/** Identyca mark: isometric network cube + person (transparent PNG). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/identyca-logo.png"
      alt=""
      aria-hidden
      width={32}
      height={32}
      className={cx("size-8 shrink-0", className)}
    />
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
