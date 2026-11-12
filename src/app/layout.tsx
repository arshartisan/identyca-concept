import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "@/styles/app.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Toaster } from "@/components/base/toast/toast";
import { MotionProvider } from "@/components/site/motion-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-source",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.identyca.io"),
  title: {
    default: "Identyca - See who matters. Connect instantly.",
    template: "%s · Identyca",
  },
  description:
    "Identyca is the networking intelligence layer for conferences: smart badges, AR glasses and an event platform that turn crowded halls into meaningful connections.",
  openGraph: {
    type: "website",
    siteName: "Identyca",
    images: ["/images/poster-rt-v2.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The site is dark-only: BoardUI's dark tokens are always on.
      className={`dark ${manrope.variable} ${instrumentSerif.variable} ${mono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background-full font-sans text-text-primary">
        <MotionProvider>
          <SmoothScroll />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}
