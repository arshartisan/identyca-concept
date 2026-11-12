import type { ReactNode } from "react";
import { RiBroadcastLine, RiLayoutGridLine, RiRadarLine } from "@remixicon/react";
import { Chip, type ChipColor } from "@/components/base/badges/chip";
import type { IconType } from "@/lib/site";
import type { ProductKey } from "@/content/solutions";
import { Accent } from "@/components/site/section";
import { cx } from "@/utils/cx";

export type ProductMeta = {
  key: ProductKey;
  /** DOM id for in-page anchors. */
  id: string;
  name: string;
  short: string;
  href: string;
  chip: ChipColor;
  icon: IconType;
  /** Label shown in the screenshot window bar. */
  frameLabel: string;
  /** Product tagline (brief §0.1), split around a serif accent. */
  tagline: ReactNode;
};

export const PRODUCT_META: Record<ProductKey, ProductMeta> = {
  realtime: {
    key: "realtime",
    id: "real-time",
    name: "Identyca Real-time",
    short: "Real-time",
    href: "/real-time",
    chip: "blue",
    icon: RiBroadcastLine,
    frameLabel: "platform.identyca.io",
    tagline: (
      <>
        See who matters. <Accent>Connect instantly.</Accent>
      </>
    ),
  },
  intel: {
    key: "intel",
    id: "event-intelligence",
    name: "Identyca Event Intelligence",
    short: "Event Intelligence",
    href: "/event-intelligence",
    chip: "purple",
    icon: RiRadarLine,
    frameLabel: "intel.identyca.io",
    tagline: (
      <>
        See who matters. <Accent>Plan what wins.</Accent>
      </>
    ),
  },
  spaces: {
    key: "spaces",
    id: "spaces",
    name: "Identyca Spaces",
    short: "Spaces",
    href: "/spaces",
    chip: "cyan",
    icon: RiLayoutGridLine,
    frameLabel: "Identyca Spaces",
    tagline: (
      <>
        See your whole venue. <Accent>Sell every event.</Accent>
      </>
    ),
  },
};

/** Small product chip with icon (BoardUI Chip, caption variant). */
export function ProductChip({ product, className }: { product: ProductKey; className?: string }) {
  const meta = PRODUCT_META[product];
  const Icon = meta.icon;
  return (
    <Chip variant="caption" color={meta.chip} className={cx("gap-1 px-2", className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {meta.short}
    </Chip>
  );
}
