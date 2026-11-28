"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { SAMPLE_BUSINESS, sampleAudit } from "@/lib/audit";
import { IssueList, ScoreSummary } from "@/components/audit-ui";
import PrintButton from "@/components/print-button";
import BrandPreview from "@/components/brand-preview";
import { DEFAULT_SCOPE, DEFAULT_TIMELINE, NON_BINDING_TEXT, NOT_INCLUDED_DEFAULT } from "@/lib/templates";
import { SakugaRating, SakugaScripts, showToast } from "@/components/sakuga";

const RATING_KEY = "dealnote-rating-v1";

export default function SamplePage() {
  const sample = sampleAudit();
  const topIssues = sample.issues.slice(0, 3);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(RATING_KEY) ?? "0");
      if (saved >= 1 && saved <= 5) setRating(saved);
    } catch {
      // No saved rating.
    }
  }, []);

  const saveRating = (next: number) => {
    setRating(next);
    try {
      if (next > 0) localStorage.setItem(RATING_KEY, String(next));
      else localStorage.removeItem(RATING_KEY);
    } catch {
      // Rating is a convenience; a failed save is not fatal.
    }
    if (next > 0) showToast("Thanks for rating this teardown.");
  };

  return (
    <section style={{ paddingTop: "3rem" }}>
      {/* Sakuga controls used on this page, lazy-loaded after the first
          paint. Toggle is loaded by BrandPreview's own SakugaToggle
          usage through the same lazy scripts on the audit page; here
          rating is the page's own control. */}
      <SakugaScripts names={["rating", "toggle"]} />
      <div className="container">
        <p className="print-stamp">SAMPLE: fictional business, fictional data</p>
        <p className="no-print"><span className="sample-stamp">SAMPLE: fictional business, fictional data</span></p>
        <h1>Website Teardown and Proposal</h1>
        <p className="reading">
          Sample report for <strong>{SAMPLE_BUSINESS.name}</strong>, {SAMPLE_BUSINESS.city}. Address{" "}
          {SAMPLE_BUSINESS.address}. Phone {SAMPLE_BUSINESS.phone}. Website{" "}
          {SAMPLE_BUSINESS.site}. This business is invented. The address, phone number, and website are
          fictional, and the findings are sample findings written to show the report format. Nothing on this
          page describes a real business.
        </p>
        <p className="reading">
          Prepared by Harbor &amp; Pine Digital, Maya Lin, maya@harborandpine-digital.example,
          (555) 019-4410, Santa Rosa, CA. Run date: 28 Nov 2026. Harbor &amp; Pine Digital is a
          fictional studio: on a real report your own brand goes here.
        </p>
        <div className="no-print" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href="/api/pdf/sample" className="btn btn-primary" download>
            Download sample report as PDF
          </a>
          <PrintButton />
          <a href="/audit" className="btn btn-secondary">Run a real audit</a>
        </div>

        <div className="mt-32">
          <ScoreSummary result={sample} />
        </div>

        <BrandPreview />

        <h2 className="mt-32">What we found, in plain language</h2>
        <p className="reading">
          The site does the basics well: it is on HTTPS, it has one clear H1, and the phone number is easy to
          find. The three findings below are the ones that cost the most calls. Each one is quick to fix.
        </p>
        <IssueList issues={topIssues} />

        <h2 className="mt-32">All findings</h2>
        <IssueList issues={sample.issues.slice(3)} />

        <h2 className="mt-32">Understanding the problem</h2>
        <p className="reading">
          The audit found {sample.issues.length} issues on the homepage. These issues may be turning away
          visitors who would otherwise call, book, or visit. No dollar-loss figure is claimed here: the
          cost is the visitors who leave without contacting you.
        </p>

        <h2 className="mt-32">What we would fix</h2>
        <div className="card glass">
          <h3>Quick wins</h3>
          <ul style={{ paddingLeft: "1.25rem" }}>
            <li>Compress the hero image below 200 KB and serve it in a modern format.</li>
            <li>Point the broken drain-cleaning link at the correct service page or remove it from the menu.</li>
            <li>Write one short alt description per image, naming the service shown.</li>
            <li>Add a sitemap.xml and list it in robots.txt.</li>
          </ul>
          <h3>Redesign</h3>
          <ul style={{ paddingLeft: "1.25rem" }}>
            <li>Cut the contact form to name, phone, and message, and ask for the address later.</li>
            <li>Make the phone number a clear call button in the mobile header.</li>
          </ul>
          <h3>Ongoing</h3>
          <ul style={{ paddingLeft: "1.25rem" }}>
            <li>Add LocalBusiness schema with name, address, phone, and opening hours.</li>
          </ul>
        </div>

        <h2 className="mt-32">Investment</h2>
        <div className="card glass">
          <div className="stack-table">
            <table>
              <thead><tr><th>Tier</th><th>Includes</th><th>Price</th></tr></thead>
              <tbody>
                <tr><td data-label="Tier">Essential</td><td data-label="Includes">Quick wins, core pages, basic SEO setup</td><td data-label="Price">To be quoted</td></tr>
                <tr><td data-label="Tier">Growth</td><td data-label="Includes">Everything in Essential, plus redesign, forms, and trust sections</td><td data-label="Price">To be quoted</td></tr>
                <tr><td data-label="Tier">Premium</td><td data-label="Includes">Everything in Growth, plus ongoing support period</td><td data-label="Price">To be quoted</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-0">
            Prices are quoted in the proposal, not shown here: the freelancer fills in the price for each
            tier before sending. Payment terms placeholder: 50% upfront, 50% on launch. This proposal is valid until [date].
          </p>
        </div>

        <h2 className="mt-32">Scope and deliverables</h2>
        <div className="card glass">
          <ul style={{ paddingLeft: "1.25rem" }}>
            {DEFAULT_SCOPE.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3>Not included</h3>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
            {NOT_INCLUDED_DEFAULT.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <h2 className="mt-32">Timeline and milestones</h2>
        <div className="card glass">
          <ul style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
            {DEFAULT_TIMELINE.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="caption mt-16 mb-0">
            Start date: [fill in]. Timings assume the client provides content and access on time.
          </p>
        </div>

        <h2 className="mt-32">About Harbor &amp; Pine Digital</h2>
        <div className="card glass">
          <p>
            Harbor &amp; Pine Digital is a fictional web design studio run by Maya Lin, based in
            Santa Rosa, CA. It builds and fixes websites for local businesses, and this sample shows
            the format every proposal uses. Nothing here describes a real studio or a real client.
          </p>
          <p className="mb-0">
            A real proposal carries the freelancer&apos;s own studio, past work, and contact details
            here. Never invent a client, a quote, or a result.
          </p>
        </div>

        <h2 className="mt-32">Terms</h2>
        <div className="card glass">
          <p>
            This proposal includes 2 rounds of design revisions. Additional revisions or work outside the
            scope described above will be quoted separately. Ownership of the finished site passes to the
            client on final payment.
          </p>
          <p className="mb-0">{NON_BINDING_TEXT}</p>
        </div>

        <div className="card glass mt-32">
          <h3>Next step</h3>
          <p>
            Reply to this email, or book a free 15-minute call at the link in the covering email. Prepared by
            Harbor &amp; Pine Digital. Lab measurement on 28 Nov 2026. Scores can vary between runs. This report audits the
            public homepage only.
          </p>
          <p className="caption mb-0">
            SAMPLE footer: this sample report is produced by DealNote for demonstration only. Client reports
            carry the freelancer&apos;s brand only, never the DealNote name.
          </p>
        </div>

        <div className="card glass mt-32">
          <h3>Rate this teardown</h3>
          <p className="caption">
            Your rating is stored only in this browser. It is not a testimonial and is never shown to
            anyone else; it is here so you can mark how useful this sample was.
          </p>
          <SakugaRating label="Rate this teardown" value={rating} onChange={saveRating} />
          {rating > 0 ? <p className="caption mt-8 mb-0">You rated this teardown {rating} out of 5.</p> : null}
        </div>

        <p className="caption mt-32">
          <Printer size={18} strokeWidth={1.5} aria-hidden style={{ verticalAlign: "text-bottom" }} />{" "}
          Use the download button above for the sample as a PDF, or the print button to save it from your
          browser. The download is the same sample report, stamped SAMPLE.
        </p>
      </div>
    </section>
  );
}
