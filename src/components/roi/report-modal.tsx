"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/site/use-reduced-motion";
import { RiErrorWarningLine, RiMailCheckLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/base/modal/modal";
import { SpinnerGlyph } from "@/components/base/spinner/spinner";
import { calculateAll } from "@/lib/roi/engine";
import { CONTACT_EMAIL } from "@/lib/site";
import type { RoiInputs, RoiLead, RoiReportRequest } from "@/lib/roi/types";
import { cx } from "@/utils/cx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR = `Something went wrong. Please try again or email ${CONTACT_EMAIL}`;
const PDF_ERROR = `We couldn't build your PDF report. Please try again or email ${CONTACT_EMAIL}`;
const EASE = [0.22, 1, 0.36, 1] as const;

type Field = keyof RoiLead;
const FIELDS: { key: Field; label: string; placeholder: string; type?: string; autoComplete: string }[] = [
  { key: "name", label: "Full Name", placeholder: "Jane Smith", autoComplete: "name" },
  { key: "company", label: "Company Name", placeholder: "Acme Events Ltd", autoComplete: "organization" },
  { key: "role", label: "Role / Title", placeholder: "Event Director", autoComplete: "organization-title" },
  { key: "email", label: "Email Address", placeholder: "jane@yourcompany.com", type: "email", autoComplete: "email" },
];

function Spinner({ className }: { className?: string }) {
  return <SpinnerGlyph size="sm" className={cx(className, "text-current")} />;
}

export function ReportModal({
  isOpen,
  onOpenChange,
  inputs,
  onSent,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Snapshot of the calculator inputs at the time of submission. */
  inputs: RoiInputs;
  onSent: (email: string) => void;
}) {
  const formId = useId();
  const reduce = useReducedMotion();
  const [lead, setLead] = useState<RoiLead>({ name: "", company: "", role: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});
  const consentRef = useRef<HTMLLabelElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const invalid = (k: Field) => {
    const v = lead[k].trim();
    return k === "email" ? !EMAIL_RE.test(v) : !v;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setAttempted(true);
    setError(null);

    const firstBad = FIELDS.find((f) => invalid(f.key));
    if (firstBad) {
      refs.current[firstBad.key]?.focus();
      return;
    }
    if (!consent) {
      consentRef.current?.querySelector("input")?.focus();
      return;
    }

    setPending(true);
    const clean: RoiLead = {
      name: lead.name.trim(),
      company: lead.company.trim(),
      role: lead.role.trim(),
      email: lead.email.trim(),
    };
    const results = calculateAll(inputs);

    // Build the PDF first; never post an empty attachment (the original's bug).
    let pdfBase64: string;
    try {
      const { generateRoiPdf } = await import("@/lib/roi/pdf");
      pdfBase64 = await generateRoiPdf(inputs, clean, results, new Date());
    } catch (err) {
      console.error("ROI PDF generation failed:", err);
      setError(PDF_ERROR);
      setPending(false);
      return;
    }

    try {
      const body: RoiReportRequest = { lead: clean, inputs, results, pdfBase64 };
      const res = await fetch("/api/roi-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(res.status === 503 && data?.error ? data.error : GENERIC_ERROR);
      }
      setSentTo(clean.email);
      closeTimer.current = setTimeout(() => {
        onOpenChange(false);
        onSent(clean.email);
      }, 2000);
    } catch (err) {
      console.error("ROI submit error:", err);
      setError(err instanceof Error && err.message ? err.message : GENERIC_ERROR);
    } finally {
      setPending(false);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && sentTo) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      onSent(sentTo);
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="md" isDismissable={!pending} isKeyboardDismissDisabled={pending}>
      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div
            key="success"
            initial={reduce ? false : { opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col gap-4"
          >
            <ModalHeader icon={RiMailCheckLine} title="Report sent!" description={<>Check your inbox at <strong className="break-all text-text-primary">{sentTo}</strong>.</>} />
            <ModalBody>
              <p>If you don&apos;t see it in 5 minutes, check your spam folder.</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </ModalFooter>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, transition: { duration: 0.15 } }} className="flex min-h-0 flex-col gap-4">
            <ModalHeader
              title="Where should we send your report?"
              description="We'll generate your personalised ROI analysis and email it to you within 5 minutes."
            />
            <ModalBody>
              <form id={formId} noValidate onSubmit={submit} className="flex flex-col gap-4 py-1">
                <div className="grid gap-4 sm:grid-cols-2">
                  {FIELDS.map((f) => (
                    <Input
                      key={f.key}
                      ref={(el) => {
                        refs.current[f.key] = el;
                      }}
                      label={f.label}
                      placeholder={f.placeholder}
                      type={f.type ?? "text"}
                      autoComplete={f.autoComplete}
                      isRequired
                      value={lead[f.key]}
                      onChange={(v) => setLead((p) => ({ ...p, [f.key]: v }))}
                      isInvalid={attempted && invalid(f.key)}
                      errorMessage={f.key === "email" && lead.email.trim() ? "Enter a valid email address" : "Required"}
                      isDisabled={pending}
                      className={f.key === "email" ? "sm:col-span-2" : undefined}
                    />
                  ))}
                </div>
                <Checkbox
                  ref={consentRef}
                  isSelected={consent}
                  onChange={setConsent}
                  isDisabled={pending}
                  isRequired
                  isInvalid={attempted && !consent}
                  className="items-start [&>span:last-child]:text-body-regular [&>span:last-child]:text-text-secondary"
                >
                  I agree to receive my personalised ROI report and occasional product updates from Identyca. You can unsubscribe at
                  any time.
                </Checkbox>
                {error ? (
                  <div role="alert" className="flex items-start gap-2 rounded-xl bg-warm-soft px-3 py-2.5 text-body-regular text-text-primary">
                    <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-warm" aria-hidden />
                    {error}
                  </div>
                ) : null}
                <p className="text-caption-1-medium text-text-tertiary">
                  Your report will arrive within 5 minutes. A copy is also sent to our team so we can follow up with tailored
                  recommendations.
                </p>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" form={formId} aria-busy={pending || undefined} leadingIcon={pending ? Spinner : undefined}>
                {pending ? "Generating your personalised report…" : "Send My Report"}
              </Button>
            </ModalFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
