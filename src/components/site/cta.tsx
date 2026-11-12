import Link from "next/link";
import type { ReactNode } from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { buttonStyles } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type IconComponent = RemixiconComponentType;

/**
 * Marketing CTA: BoardUI's button variants on a Next <Link>, plus a roomier
 * size for heroes. `primary` renders the glow variant. External/mailto hrefs render a plain anchor.
 */
export function Cta({
  href,
  children,
  variant = "primary",
  size = "lg",
  trailingIcon: Trailing,
  leadingIcon: Leading,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "md";
  trailingIcon?: IconComponent;
  leadingIcon?: IconComponent;
  className?: string;
}) {
  const classes = cx(
    buttonStyles.base,
    buttonStyles.variant[variant === "primary" ? "glow" : variant],
    "group/cta rounded-full",
    size === "lg" ? "h-12 gap-1.5 px-5 text-headline-medium" : "h-10 gap-1 px-4 text-body-medium",
    className,
  );
  const content = (
    <>
      {Leading ? <Leading className="size-[18px] shrink-0" aria-hidden /> : null}
      <span>{children}</span>
      {Trailing ? (
        <Trailing
          className="size-[18px] shrink-0 transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5"
          aria-hidden
        />
      ) : null}
    </>
  );
  const external = /^(https?:|mailto:|tel:)/.test(href);
  return external ? (
    <a href={href} className={classes} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
