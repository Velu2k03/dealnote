import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/site";
import Footer from "@/components/footer";

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
    "Paste any business website URL. Get a white-label teardown report plus a ready-to-send proposal in about a minute, under your own brand.",
  openGraph: {
    title: "DealNote: website teardown and proposal generator",
    description:
      "Paste any business website URL. Get a teardown report plus a ready-to-send proposal.",
    url: "https://dealnote-blue.vercel.app",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DealNote — paste any business URL. Get a teardown report plus a ready-to-send proposal." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DealNote: website teardown and proposal generator",
    description:
      "Paste any business website URL. Get a teardown report plus a ready-to-send proposal.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* TODO: Ship or Die tracker snippet goes here — copy the EXACT snippet from the Ship or Die dashboard (My Startup > traffic tracker) into <head> on every page BEFORE any traffic and BEFORE the first payment. Do not invent the snippet. */}
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
