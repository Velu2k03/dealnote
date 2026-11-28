import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/site";
import Footer from "@/components/footer";
import { MotionProvider } from "@/components/motion-ui";
import { SakugaScripts, SakugaToastHost } from "@/components/sakuga";

// Font choice, recorded: Inter, loaded via next/font/google so the named
// font is the rendered font (weights 400/500/600/700). Previously the CSS
// named Inter but no font was loaded and the site rendered in system-ui.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dealnote-blue.vercel.app"),
  title: "DealNote: website teardown and proposal generator for web designers",
  description:
    "Show the prospect what is wrong with their site, then sell the fix. DealNote turns any business website into a white-label teardown report plus a ready-to-send proposal in about a minute, under your own brand.",
  openGraph: {
    title: "DealNote: website teardown and proposal generator",
    description:
      "Show the prospect what is wrong with their site, then sell the fix.",
    url: "https://dealnote-blue.vercel.app",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DealNote: show the prospect what is wrong with their site, then sell the fix." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DealNote: website teardown and proposal generator",
    description:
      "Show the prospect what is wrong with their site, then sell the fix.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Ship or Die hackathon traffic tracker. It MUST load through
            next/script, never through a hand-written <head> with
            dangerouslySetInnerHTML: a custom <head> makes React's head
            management remove Next's own stylesheet <link> on every
            client-side navigation, so soft navigation rendered unstyled
            Times New Roman and sometimes crashed with removeChild
            errors (Neon whole-site audit P0-1, reproduced locally
            28 Nov 2026). The script tag itself is unchanged: same
            src, same data-site value, byte-identical to the snippet
            from the Ship or Die dashboard. */}
        <Script
          src="https://www.ship-or-die.com/hackathon/verify.js"
          data-site="d40c7a78322ccb335a973aa331f31294d5cbddcb"
          strategy="afterInteractive"
        />
        <MotionProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SakugaToastHost />
        </MotionProvider>
        {/* Sakuga VFX (28 Nov 2026, MIT): button, toast and tooltip are
            used on every page, so they load afterInteractive; the rest
            load lazily per page in components/sakuga.tsx. No Sakuga
            element is rendered on /terms or /privacy, so those pages
            keep their simple fade only. */}
        <SakugaScripts names={["button", "toast", "tooltip"]} strategy="afterInteractive" />
      </body>
    </html>
  );
}
