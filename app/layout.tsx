import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/site";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "DealNote: website teardown and proposal generator for web designers",
  description:
    "Paste any business website URL. Get a white-label teardown report plus a ready-to-send proposal in about a minute, under your own brand.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
