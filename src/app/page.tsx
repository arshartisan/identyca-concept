import { HomeHero } from "@/components/home/home-hero";
import { AudienceMarquee } from "@/components/home/audience-marquee";
import { ProductSuite } from "@/components/home/product-suite";
import { Lifecycle } from "@/components/home/lifecycle";
import {
  Comparison,
  Differentiators,
  ExplainerVideos,
  Numbers,
  Testimonials,
  WhyChoose,
} from "@/components/home/home-sections";
import { CtaBand } from "@/components/site/blocks";

export default function Home() {
  return (
    <>
      <HomeHero />
      <AudienceMarquee />
      <ProductSuite />
      <ExplainerVideos />
      <Differentiators />
      <Lifecycle />
      <Numbers />
      <WhyChoose />
      <Comparison />
      <Testimonials />
      <CtaBand />
    </>
  );
}
