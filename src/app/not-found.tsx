import { RiArrowRightLine } from "@remixicon/react";
import { Accent, Container } from "@/components/site/section";
import { Cta } from "@/components/site/cta";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-40 pb-32">
      <div aria-hidden className="bg-grid mask-radial absolute inset-x-0 top-0 h-[600px] opacity-70" />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <p className="eyebrow text-text-tertiary">404 · Nobody here</p>
        <h1 className="text-hero text-balance text-text-primary">
          This page isn&apos;t <Accent>on the floor</Accent>.
        </h1>
        <p className="text-lead max-w-md text-text-secondary">The link may be old, or the page has moved. Let&apos;s get you back to who matters.</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Cta href="/" trailingIcon={RiArrowRightLine}>Back to home</Cta>
          <Cta href="/demo" variant="secondary">Book a demo</Cta>
        </div>
      </Container>
    </section>
  );
}
