import { Printer } from "lucide-react";
import { SAMPLE_BUSINESS, sampleAudit } from "@/lib/audit";
import { IssueList, ScoreSummary } from "@/components/audit-ui";
import PrintButton from "@/components/print-button";
import { DEFAULT_SCOPE, DEFAULT_TIMELINE, NON_BINDING_TEXT, NOT_INCLUDED_DEFAULT } from "@/lib/templates";

export default function SamplePage() {
  const sample = sampleAudit();
  const topIssues = sample.issues.slice(0, 3);

  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <p><span className="sample-stamp">SAMPLE: fictional business, fictional data</span></p>
        <h1>Website Teardown and Proposal</h1>
        <p className="reading">
          Sample report for <strong>{SAMPLE_BUSINESS.name}</strong>, {SAMPLE_BUSINESS.city}. Address{" "}
          {SAMPLE_BUSINESS.address}. Phone {SAMPLE_BUSINESS.phone}. Website{" "}
          {SAMPLE_BUSINESS.site}. This business is invented. The address, phone number, and website are
          fictional, and the findings are sample findings written to show the report format. Nothing on this
          page describes a real business.
        </p>
        <p className="reading">
          Prepared by [Your studio], [Your name], [your email]. Run date: 27 Nov 2026.
        </p>
        <div className="no-print" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <PrintButton />
          <a href="/audit" className="btn btn-secondary">Run a real audit</a>
        </div>

        <div className="mt-32">
          <ScoreSummary result={sample} />
        </div>

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
        <div className="card">
          <h3>Quick wins</h3>
          <ul style={{ paddingLeft: 20 }}>
            <li>Compress the hero image below 200 KB and serve it in a modern format.</li>
            <li>Point the broken drain-cleaning link at the correct service page or remove it from the menu.</li>
            <li>Write one short alt description per image, naming the service shown.</li>
            <li>Add a sitemap.xml and list it in robots.txt.</li>
          </ul>
          <h3>Redesign</h3>
          <ul style={{ paddingLeft: 20 }}>
            <li>Cut the contact form to name, phone, and message, and ask for the address later.</li>
            <li>Make the phone number a clear call button in the mobile header.</li>
          </ul>
          <h3>Ongoing</h3>
          <ul style={{ paddingLeft: 20 }}>
            <li>Add LocalBusiness schema with name, address, phone, and opening hours.</li>
          </ul>
        </div>

        <h2 className="mt-32">Investment</h2>
        <div className="card">
          <div className="stack-table">
            <table>
              <thead><tr><th>Tier</th><th>Includes</th><th>Price</th></tr></thead>
              <tbody>
                <tr><td data-label="Tier">Essential</td><td data-label="Includes">Quick wins, core pages, basic SEO setup</td><td data-label="Price">$____</td></tr>
                <tr><td data-label="Tier">Growth</td><td data-label="Includes">Everything in Essential, plus redesign, forms, and trust sections</td><td data-label="Price">$____</td></tr>
                <tr><td data-label="Tier">Premium</td><td data-label="Includes">Everything in Growth, plus ongoing support period</td><td data-label="Price">$____</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-0">
            Prices are blank placeholders in this sample. The freelancer fills them in before sending.
            Payment terms placeholder: 50% upfront, 50% on launch. This proposal is valid until [date].
          </p>
        </div>

        <h2 className="mt-32">Scope and deliverables</h2>
        <div className="card">
          <ul style={{ paddingLeft: 20 }}>
            {DEFAULT_SCOPE.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3>Not included</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
            {NOT_INCLUDED_DEFAULT.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <h2 className="mt-32">Timeline and milestones</h2>
        <div className="card">
          <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
            {DEFAULT_TIMELINE.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="caption mt-16 mb-0">
            Start date: [fill in]. Timings assume the client provides content and access on time.
          </p>
        </div>

        <h2 className="mt-32">About [Your Studio Name]</h2>
        <div className="card">
          <p>
            [Your Studio Name] is a web design studio run by [Your Name], based in [Your City]. We build
            and fix websites for local businesses, and this sample shows the format every proposal uses.
          </p>
          <p className="mb-0">
            [PAST PROJECT - Replace with a real project or delete this section. Never invent a client, a
            quote, or a result.]
          </p>
        </div>

        <h2 className="mt-32">Terms</h2>
        <div className="card">
          <p>
            This proposal includes 2 rounds of design revisions. Additional revisions or work outside the
            scope described above will be quoted separately. Ownership of the finished site passes to the
            client on final payment.
          </p>
          <p className="mb-0">{NON_BINDING_TEXT}</p>
        </div>

        <div className="card mt-32">
          <h3>Next step</h3>
          <p>
            Reply to this email, or book a free 15-minute call at the link in the covering email. Prepared by
            Your Studio. Lab measurement on 27 Nov 2026. Scores can vary between runs. This report audits the
            public homepage only.
          </p>
          <p className="caption mb-0">
            SAMPLE footer: this sample report is produced by DealNote for demonstration only. Client reports
            carry the freelancer&apos;s brand only, never the DealNote name.
          </p>
        </div>

        <p className="caption mt-32">
          <Printer size={18} strokeWidth={1.5} aria-hidden style={{ verticalAlign: "text-bottom" }} />{" "}
          Use the print button above to save this sample as a PDF from your browser. Print-to-PDF covers the
          sample report only in v1.
        </p>
      </div>
    </section>
  );
}
