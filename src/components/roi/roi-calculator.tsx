"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import {
  RiAlertLine,
  RiCalendarEventLine,
  RiCpuLine,
  RiMoneyDollarCircleLine,
  RiSettings3Line,
} from "@remixicon/react";
import { Accordion, AccordionItem } from "@/components/base/accordion/accordion";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioGroup } from "@/components/base/radio/radio";
import { RadioCard } from "@/components/base/radio/radio-card";
import { Select, SelectItem } from "@/components/base/select/select";
import { Switch } from "@/components/base/switch/switch";
import { DEFAULT_FORM, calculate, normalizePct, selectTier, toInputs, totalTechSpend } from "@/lib/roi/engine";
import { fmtUSD } from "@/lib/roi/format";
import type { RoiFormValues, Tier } from "@/lib/roi/types";
import { cx } from "@/utils/cx";
import { FormSection, LiveNumberField, PercentSlider } from "./fields";
import { LivePreview } from "./live-preview";
import { ReportModal } from "./report-modal";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIER_NOTE: Record<Tier, { name: string; body: string }> = {
  LITE: {
    name: "Lite tier",
    body: "NFC badges with a full event app, lead capture, registration and ticketing. Lite has no real-time networking.",
  },
  CONNECT: {
    name: "Connect tier",
    body: "real-time networking with batteryless badges, no anchors and no on-site install.",
  },
  VISION: {
    name: "Vision tier",
    body: "a premium networking AR+app experience for your VIP and sponsor delegates at B2B conferences.",
  },
  INSIGHT: {
    name: "Insight tier",
    body: "a premium networking app experience for your VIP and sponsor delegates at large tradeshows/expos.",
  },
};

const DAY_OPTIONS = [1, 2, 3, 4, 5].map((d) => ({ id: String(d), label: `${d} day${d > 1 ? "s" : ""}` }));
const SLOT_OPTIONS = [0, 1, 2, 3, 4, 5].map((n) => ({ id: String(n), label: String(n) }));

/** Smoothly mounts/unmounts conditional fields (fade + small blur, height). */
function Reveal({ show, children, className }: { show: boolean; children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.div
          className={cx("overflow-hidden", className)}
          initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0, filter: "blur(4px)" }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto", filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, filter: "blur(4px)", transition: { duration: 0.22, ease: "easeIn" } }}
          transition={{ duration: 0.36, ease: EASE }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function RoiCalculator() {
  const [form, setForm] = useState<RoiFormValues>(DEFAULT_FORM);
  const [modalOpen, setModalOpen] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const set = useCallback(<K extends keyof RoiFormValues>(key: K) => (value: RoiFormValues[K]) => setForm((f) => ({ ...f, [key]: value })), []);

  const inputs = useMemo(() => toInputs(form), [form]);
  const baseline = useMemo(() => calculate(inputs, "baseline"), [inputs]);
  const tier = selectTier(inputs.A2, inputs.D0, inputs.D1);
  const pctTotal = form.A3 + form.A4 + form.A5;
  const pctOff = Math.abs(pctTotal - 100) > 0.5;
  const showArToggle = form.D0 === "rt" && inputs.A2 <= 1000;
  const techTotal = totalTechSpend(form);

  const fixPct = () => {
    const [a3, a4, a5] = normalizePct(form.A3, form.A4, form.A5);
    setForm((f) => ({ ...f, A3: a3, A4: a4, A5: a5 }));
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
      {/* ------------------------------------------------------------ inputs */}
      <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
        <FormSection index="01" icon={RiCalendarEventLine} title="Event profile" description="The size, shape and audience of your event.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Event Name (optional)"
              placeholder="e.g. FinTech Summit 2026"
              value={form.A1}
              onChange={set("A1")}
              className="sm:col-span-2"
            />
            <LiveNumberField label="Total Attendees" isRequired defaultValue={DEFAULT_FORM.A2} min={50} max={50000} step={50} onValue={set("A2")} />
            <Select
              label="Event Duration"
              value={String(form.A8)}
              onChange={(k) => k != null && set("A8")(Number(k))}
              triggerClassName="h-9"
            >
              {DAY_OPTIONS.map((o) => (
                <SelectItem key={o.id} id={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </Select>
            <div className="flex flex-col gap-5 sm:col-span-2">
              <PercentSlider label="% Buyer / End-User Delegates" value={form.A3} onChange={set("A3")} />
              <PercentSlider label="% Vendor / Exhibitor Delegates" value={form.A4} onChange={set("A4")} />
              <PercentSlider label="% Speaker / VIP Delegates" value={form.A5} onChange={set("A5")} />
              <Reveal show={pctOff}>
                <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-warm-soft px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-body-regular text-text-primary">
                    <RiAlertLine className="size-4 shrink-0 text-warm" aria-hidden />
                    <span>
                      Delegate percentages must total 100%. Currently: <strong className="tabular-nums">{pctTotal}%</strong>
                    </span>
                  </span>
                  <Button size="small" variant="secondary" onClick={fixPct}>
                    Fix this
                  </Button>
                </div>
              </Reveal>
            </div>
            <LiveNumberField label="Number of Exhibitors" defaultValue={DEFAULT_FORM.A6} min={0} max={5000} onValue={set("A6")} />
            <LiveNumberField label="Number of Sponsors" defaultValue={DEFAULT_FORM.A7} min={0} max={500} onValue={set("A7")} />
            <LiveNumberField
              label="Venue Size (sqm)"
              hint="Approximate total floor area of your event venue"
              defaultValue={DEFAULT_FORM.A9}
              min={100}
              max={500000}
              step={100}
              onValue={set("A9")}
            />
            <LiveNumberField label="Events Per Year" defaultValue={DEFAULT_FORM.A10} min={1} max={50} onValue={set("A10")} />
          </div>
        </FormSection>

        <FormSection index="02" icon={RiMoneyDollarCircleLine} title="Current pricing & revenue" description="What your tickets, stands and sponsorships earn today.">
          <div className="grid gap-5 sm:grid-cols-2">
            <LiveNumberField label="Buyer Delegate Ticket Price" currency defaultValue={DEFAULT_FORM.B1} min={0} step={50} onValue={set("B1")} />
            <LiveNumberField label="Vendor Delegate Ticket Price" currency defaultValue={DEFAULT_FORM.B2} min={0} step={50} onValue={set("B2")} />
            <LiveNumberField label="Avg. Exhibitor Package Value" currency defaultValue={DEFAULT_FORM.B3} min={0} step={500} onValue={set("B3")} />
            <LiveNumberField label="Avg. Sponsorship Package Value" currency defaultValue={DEFAULT_FORM.B4} min={0} step={1000} onValue={set("B4")} />
            <PercentSlider label="Exhibitor Renewal Rate - Current" value={form.B5} onChange={set("B5")} />
            <PercentSlider label="Sponsor Renewal Rate - Current" value={form.B6} onChange={set("B6")} />
          </div>
        </FormSection>

        <FormSection
          index="03"
          icon={RiCpuLine}
          title="Current event tech spend, per event"
          description="Identyca replaces your existing ticketing, registration, networking app, badge issuance, and lead retrieval systems. Enter what you currently spend per event on these so we can calculate your savings."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <LiveNumberField label="Ticketing & Registration Platform" currency defaultValue={DEFAULT_FORM.C1} min={0} step={250} onValue={set("C1")} />
            <LiveNumberField label="Networking / Event App" currency defaultValue={DEFAULT_FORM.C2} min={0} step={250} onValue={set("C2")} />
            <LiveNumberField label="Badge Printing & Issuance" currency defaultValue={DEFAULT_FORM.C3} min={0} step={250} onValue={set("C3")} />
            <LiveNumberField label="Lead Retrieval System" currency defaultValue={DEFAULT_FORM.C4} min={0} step={250} onValue={set("C4")} />
            <LiveNumberField label="Other Replaceable Tech" currency defaultValue={DEFAULT_FORM.C5} min={0} step={250} onValue={set("C5")} />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-background-sunken px-4 py-3">
            <span className="text-body-medium text-text-secondary">Total Current Tech Spend</span>
            <span className="text-title-3-semibold tabular-nums text-text-primary">{fmtUSD(techTotal)}</span>
          </div>
        </FormSection>

        <FormSection index="04" icon={RiSettings3Line} title="Identyca configuration" description="Choose your badges and how you'll monetise the upgrades.">
          <div className="flex flex-col gap-5">
            <RadioGroup
              aria-label="Which type of badges would you like?"
              value={form.D0}
              onChange={(v) => set("D0")(v === "nfc" ? "nfc" : "rt")}
              className="gap-2"
            >
              <span className="text-body-medium text-text-primary">Which type of badges would you like?</span>
              <div className="grid gap-2 sm:grid-cols-2">
                <RadioCard value="rt" title="Smart badges" description="Real-time networking + analytics" />
                <RadioCard value="nfc" title="NFC badges" description="Tap-to-exchange, full event app" />
              </div>
            </RadioGroup>

            <Reveal show={showArToggle}>
              <div className="flex flex-col gap-2 rounded-2xl border border-border-hairline p-4">
                <span className="text-body-medium text-text-primary">Would you like AR glasses onsite?</span>
                <Switch isSelected={form.D1} onChange={set("D1")}>
                  <span className="text-body-regular text-text-secondary">
                    {form.D1 ? "Yes — we will have AR glasses onsite" : "No — no AR glasses onsite"}
                  </span>
                </Switch>
              </div>
            </Reveal>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={tier}
                initial={{ opacity: 0, filter: "blur(2px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(2px)", transition: { duration: 0.15 } }}
                transition={{ duration: 0.22, ease: EASE }}
                className="rounded-2xl bg-signal-soft px-4 py-3 text-body-regular text-text-primary"
              >
                Your event qualifies for our <strong>{TIER_NOTE[tier].name}</strong> - {TIER_NOTE[tier].body}
              </motion.p>
            </AnimatePresence>

            <Reveal show={tier === "VISION"}>
              <div className="grid gap-5 sm:grid-cols-2">
                <PercentSlider label="Target Smart Glasses Adoption Rate" min={5} max={60} value={form.D2} onChange={set("D2")} />
                <LiveNumberField label="Smart Glasses Resale Price to Delegates" currency defaultValue={form.D3} min={0} step={50} onValue={set("D3")} />
              </div>
            </Reveal>
            <Reveal show={tier === "CONNECT"}>
              <div className="grid gap-5 sm:grid-cols-2">
                <PercentSlider label="Target App Adoption Rate" min={5} max={60} value={form.D2app} onChange={set("D2app")} />
                <LiveNumberField label="App Upgrade Resale Price to Delegates" currency defaultValue={form.D3app} min={0} step={10} onValue={set("D3app")} />
              </div>
            </Reveal>
            <Reveal show={tier === "INSIGHT"}>
              <div className="grid gap-5 sm:grid-cols-2">
                <PercentSlider label="Target App Upgrade Adoption Rate" min={5} max={60} value={form.D2insight} onChange={set("D2insight")} />
                <LiveNumberField label="App Upgrade Resale Price to Delegates" currency defaultValue={form.D3insight} min={0} step={10} onValue={set("D3insight")} />
              </div>
            </Reveal>
            <Reveal show={tier !== "LITE"}>
              <div className="grid gap-5 sm:grid-cols-2">
                <LiveNumberField
                  label="Exhibitor Analytics Upsell Price"
                  hint="What you'll charge exhibitors for real-time analytics & lead insights"
                  currency
                  defaultValue={form.D4}
                  min={0}
                  step={100}
                  onValue={set("D4")}
                />
                <PercentSlider label="Exhibitor Analytics Adoption Rate" min={0} max={80} value={form.D5} onChange={set("D5")} />
                <Select
                  label="Number of App Sponsorship Slots"
                  value={String(form.D6)}
                  onChange={(k) => k != null && set("D6")(Number(k))}
                  triggerClassName="h-9"
                >
                  {SLOT_OPTIONS.map((o) => (
                    <SelectItem key={o.id} id={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </Select>
                <LiveNumberField label="App Sponsorship Price per Slot" currency defaultValue={form.D7} min={0} step={250} onValue={set("D7")} />
              </div>
            </Reveal>
          </div>
        </FormSection>

        <Accordion variant="separated" className="[&>*]:rounded-3xl [&>*]:border-border-hairline [&>*]:bg-background-elevated [&>*]:shadow-none">
          <AccordionItem id="advanced" title="Advanced settings" description="Your networking and lead benchmarks without Identyca." headingLevel={2}>
            <div className="grid gap-5 pt-2 sm:grid-cols-2">
              <LiveNumberField
                label="Avg. Meaningful Connections per Attendee (Without Identyca)"
                defaultValue={DEFAULT_FORM.E1}
                min={1}
                max={200}
                onValue={set("E1")}
              />
              <LiveNumberField
                label="Avg. Qualified Leads per Exhibitor (Without Identyca)"
                defaultValue={DEFAULT_FORM.E2}
                min={1}
                max={5000}
                onValue={set("E2")}
              />
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ----------------------------------------------------------- preview */}
      <aside aria-label="Live ROI preview" className="lg:sticky lg:top-24">
        <LivePreview result={baseline} onGenerate={() => setModalOpen(true)} sentTo={sentTo} />
      </aside>

      <ReportModal isOpen={modalOpen} onOpenChange={setModalOpen} inputs={inputs} onSent={setSentTo} />
    </div>
  );
}

