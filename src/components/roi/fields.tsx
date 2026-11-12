"use client";

import { useId, type ReactNode } from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { NumberField } from "@/components/base/number-field/number-field";
import { Slider } from "@/components/base/slider/slider";
import { Card } from "@/components/site/section";
import { cx } from "@/utils/cx";

/** Parse whatever is in a formatted number input ("$1,500", "3 000") while typing. */
function parseLoose(text: string): number {
  const cleaned = text.replace(/[^0-9.-]/g, "");
  return cleaned === "" ? Number.NaN : Number(cleaned);
}

/**
 * Number input that reports its value on every keystroke (for the live
 * preview), not only on blur like React Aria's NumberField. Uncontrolled on
 * purpose: React Aria reformats a controlled value mid-typing.
 */
export function LiveNumberField({
  label,
  hint,
  defaultValue,
  onValue,
  min,
  max,
  step = 1,
  currency = false,
  isRequired,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  defaultValue: number;
  onValue: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  currency?: boolean;
  isRequired?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx("min-w-0", className)}
      onInput={(e) => {
        const t = e.target as HTMLInputElement;
        if (t.tagName === "INPUT") onValue(parseLoose(t.value));
      }}
    >
      <NumberField
        label={label}
        hint={hint}
        defaultValue={defaultValue}
        minValue={min}
        maxValue={max}
        step={step}
        isRequired={isRequired}
        onChange={onValue}
        formatOptions={currency ? { style: "currency", currency: "USD", maximumFractionDigits: 0 } : { maximumFractionDigits: 0 }}
      />
    </div>
  );
}

/** Percentage slider with a label row and a live value readout. */
export function PercentSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <span id={id} className="text-body-medium text-text-primary">
          {label}
        </span>
        <output aria-hidden className="shrink-0 font-mono text-body-medium tabular-nums text-text-primary">
          {value}%
        </output>
      </div>
      <Slider
        aria-labelledby={id}
        thumbLabel={label}
        value={value}
        onChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        minValue={min}
        maxValue={max}
        step={1}
        showTooltip={false}
        // Values are whole percents, so format as a unit rather than style: "percent".
        formatOptions={{ style: "unit", unit: "percent", maximumFractionDigits: 0 }}
      />
      {hint ? <p className="text-caption-1-medium text-text-secondary">{hint}</p> : null}
    </div>
  );
}

/** A grouped calculator section card with a numbered header. */
export function FormSection({
  index,
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  index: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: RemixiconComponentType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cx("p-5 sm:p-7", className)}>
      <header className="mb-6 flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-hairline bg-background-full text-foreground-icon-primary">
          {Icon ? <Icon className="size-5" aria-hidden /> : <span className="font-mono text-caption-1-medium">{index}</span>}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="eyebrow text-text-tertiary">Step {index}</span>
          <h2 className="text-title-3-semibold tracking-[-0.02em] text-text-primary">{title}</h2>
          {description ? <p className="text-body-regular text-text-secondary">{description}</p> : null}
        </div>
      </header>
      {children}
    </Card>
  );
}
