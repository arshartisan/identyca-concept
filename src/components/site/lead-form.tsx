"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RiCheckLine, RiArrowRightLine } from "@remixicon/react";
import { Input } from "@/components/base/input/input";
import { Textarea } from "@/components/base/textarea/textarea";
import { Button } from "@/components/base/buttons/button";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { CONTACT_EMAIL } from "@/lib/site";
import { EASE } from "./motion";

/** Existing lead-capture endpoint used by the previous site. */
const LEADS_ENDPOINT = "https://identyca-leads.vibhaspahuja1.workers.dev/";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadType = "demo" | "pilot";

export function LeadForm({ defaultType = "demo" }: { defaultType?: LeadType }) {
  const [type, setType] = useState<LeadType>(defaultType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    setFormError(null);
    try {
      const body: Record<string, string> = { type, name: name.trim(), email: email.trim(), message: message.trim() };
      if (organization.trim()) body.organization = organization.trim();
      const res = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let msg = `Submission failed (${res.status}). Please try again or email ${CONTACT_EMAIL}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setFormError(
        err instanceof TypeError
          ? `Could not reach the server. Please check your connection or email ${CONTACT_EMAIL}`
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col items-center gap-4 py-12 text-center"
          role="status"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-signal-soft text-signal">
            <RiCheckLine className="size-7" aria-hidden />
          </span>
          <h2 className="text-title-1-semibold text-text-primary">You&apos;re on the list!</h2>
          <p className="max-w-sm text-body-regular text-text-secondary">
            Thanks — we&apos;ll reach out to <strong className="text-text-primary">{email}</strong> within 24 hours.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.2 } }}
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-5"
        >
          <SegmentedControl
            aria-label="Request type"
            selectedKeys={[type]}
            onSelectionChange={(keys) => {
              const k = [...keys][0];
              if (k === "demo" || k === "pilot") setType(k);
            }}
            className="w-full [&>button]:flex-1"
          >
            <SegmentedControlItem id="demo">Book a demo</SegmentedControlItem>
            <SegmentedControlItem id="pilot">Reserve a pilot slot</SegmentedControlItem>
          </SegmentedControl>
          <p className="text-body-regular text-text-secondary">
            {type === "demo"
              ? "Tell us a bit about yourself and we'll be in touch within 24 hours."
              : "Limited pilot slots available for 2026 events. Secure yours now."}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Full name"
              isRequired
              placeholder="Jane Smith"
              value={name}
              onChange={setName}
              autoComplete="name"
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            <Input
              label="Work email"
              type="email"
              isRequired
              placeholder="jane@yourcompany.com"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
          </div>
          <Input
            label="Organization"
            placeholder="Company / Event name"
            value={organization}
            onChange={setOrganization}
            autoComplete="organization"
          />
          <Textarea
            label="Message"
            hint="Optional"
            placeholder="Tell us about your event or questions…"
            rows={4}
            value={message}
            onChange={setMessage}
          />
          {formError ? (
            <p role="alert" className="rounded-xl bg-background-tertiary-error px-4 py-3 text-body-regular text-text-error-primary">
              {formError}
            </p>
          ) : null}
          <Button type="submit" disabled={status === "sending"} trailingIcon={RiArrowRightLine} className="h-11 w-full rounded-full">
            {status === "sending" ? "Sending…" : "Submit"}
          </Button>
          <p className="text-center text-caption-1-medium text-text-tertiary">
            Prefer email?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-text-secondary underline-offset-4 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
