import Link from "next/link";
import { CheckCircle2, FileText, Globe, Send } from "lucide-react";
import { sampleAudit } from "@/lib/audit";
import { BuyButton, IssueList, ScoreSummary } from "@/components/audit-ui";

export default function Home() {
  const sample = sampleAudit();
  const topIssues = sample.issues.slice(0, 3);

  return (
    <>
      <section style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">For web design freelancers and small agencies</p>
              <h1>Paste any business website URL.</h1>
              <p style={{ color: "#475569" }}>
                Get a teardown report plus a ready-to-send proposal in about a minute. Show the prospect what is
                wrong with their site, then sell the fix. The report carries your brand, your logo, and your
                contact details, not ours.
              </p>
              <form method="get" action="/audit" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input
                  name="url"
                  type="url"
                  required
                  aria-label="Business website URL"
                  placeholder="https://www.example-plumbing.com"
                  style={{ flex: "1 1 280px" }}
                />
                <button className="btn btn-primary" type="submit">
                  Run a free audit
                </button>
              </form>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                <Link href="/sample" className="btn btn-secondary">
                  See a sample report
                </Link>
              </div>
              <p className="caption mt-24">
                $49 one-time, with no subscription and no per-report fee.
              </p>
            </div>
            <div>
              <ScoreSummary result={sample} sampleLabel />
              <p className="caption mt-16">
                This is the real audit layout, filled with fictional data for a fictional business. The
                sample report page shows the full version.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container">
          <h2>How it works</h2>
          <div className="steps-flow mt-24">
            <div className="step-row">
              <span className="step-num" aria-hidden>1</span>
              <div>
                <h3 className="mt-0" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Globe size={18} strokeWidth={1.5} color="#475569" aria-hidden /> Paste a URL
                </h3>
                <p className="mb-0">
                  Paste the prospect&apos;s website address. DealNote fetches the public homepage and checks
                  speed, mobile, SEO, technical health, conversion, and trust signals.
                </p>
              </div>
            </div>
            <div className="step-row">
              <span className="step-num" aria-hidden>2</span>
              <div>
                <h3 className="mt-0" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <FileText size={18} strokeWidth={1.5} color="#475569" aria-hidden /> Get the teardown
                </h3>
                <p className="mb-0">
                  Every finding shows what was found, why it matters in plain language, and the fix in one
                  line. Scores use A to F grades, with the weights printed on the report.
                </p>
              </div>
            </div>
            <div className="step-row">
              <span className="step-num" aria-hidden>3</span>
              <div>
                <h3 className="mt-0" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Send size={18} strokeWidth={1.5} color="#475569" aria-hidden /> Send the proposal
                </h3>
                <p className="mb-0">
                  The findings become a What I Would Fix list with blank price placeholders you fill in. Send
                  the teardown to open the conversation, and the proposal when they reply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>What a teardown finds</h2>
          <p className="reading">
            Three findings from the sample report for Harbor and Pine Plumbing, a fictional business. Each
            finding is written for the business owner, not for a developer.
          </p>
          <div className="mt-24">
            <IssueList issues={topIssues} />
          </div>
          <Link href="/sample" className="btn btn-secondary">
            Read the full sample report
          </Link>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container">
          <h2>Pricing</h2>
          <div className="card mt-24" style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 48, fontWeight: 600, lineHeight: 1, margin: "0 0 8px" }} className="tabular">
              $49
            </p>
            <p>One payment of $49, with no subscription and no per-report fee.</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>30 audits a month fair-use limit, about $1.63 per audit</li>
              <li>White-label reports under your brand</li>
              <li>Teardown PDF and proposal PDF (coming with payment)</li>
              <li>Proposal templates included</li>
            </ul>
            <p className="caption">
              $49 once is less than two months of a $39-per-month subscription. SEOptimer White Label,
              $39/mo on its public pricing page, checked 27 Nov 2026. Example only. Compare current prices before you buy. No guarantee of client wins.
            </p>
            <p className="mb-16">
              <BuyButton />
            </p>
            <p className="caption">
              Bad report? Report it within 14 days for a replacement or refund. Email{" "}
              <a href="mailto:murugan@drvelu.com?subject=DealNote%20refund%20request">murugan@drvelu.com</a>{" "}
              with the report URL, the finding, and why. See the refund section in the terms.
            </p>
            <p className="caption mb-0">
              The audit tool is free to try. Full reports and PDF downloads unlock with a licence key.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>What DealNote checks, and what it does not</h2>
          <div className="two-col mt-24">
            <div className="card">
              <h3>It checks the page you paste</h3>
              <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                <li>Speed, measured in the run, plus page weight</li>
                <li>Mobile viewport and tap-to-call links</li>
                <li>Title, meta description, headings, image alt text</li>
                <li>HTTPS, canonical, robots.txt, sitemap, broken links</li>
                <li>Calls to action, phone visibility, forms</li>
                <li>LocalBusiness schema, social links, favicon</li>
              </ul>
            </div>
            <div className="card">
              <h3>It does not estimate or guess</h3>
              <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                <li>No traffic or ranking estimates</li>
                <li>No invented dollar-loss figures for the prospect</li>
                <li>No Google Maps or Places data</li>
                <li>No backlinks or keyword rankings</li>
                <li>No multi-page crawl in v1, homepage only</li>
                <li>No accessibility score presented as a legal claim</li>
              </ul>
            </div>
          </div>
          <p className="caption mt-24">
            Scores are lab measurements on the run date under stated conditions. Scores can vary between runs.
          </p>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="container">
          <h2>Frequently asked questions</h2>
          <div className="reading mt-24">
            <h3>Is the $49 really one-time?</h3>
            <p>
              Yes. You pay $49 once, with no subscription and no per-report fee. The fair-use limit is
              stated on the pricing card above and in the terms. Lifetime means the lifetime of the product,
              as stated in the terms.
            </p>
            <h3>Does the client see the DealNote name?</h3>
            <p>
              No. Reports carry your brand name, logo, colours, and contact details. The DealNote name
              appears only in this app and on the sample report, which is labelled as a sample.
            </p>
            <h3>Can I edit the proposal before sending it?</h3>
            <p>
              Yes. Prices, timeline, and the summary are editable drafts. Prices are blank placeholders
              you fill in. DealNote never invents a price for your work.
            </p>
            <h3>What if the report gets something wrong?</h3>
            <p>
              Report a bad report within 14 days and we will replace it or refund it. Email{" "}
              <a href="mailto:murugan@drvelu.com?subject=DealNote%20refund%20request">murugan@drvelu.com</a>{" "}
              with the report URL, the finding you say is wrong, and why. See the refund section in the terms.
            </p>
            <h3>Does DealNote collect personal data about the prospect?</h3>
            <p>
              No. The audit reads the public homepage only. Contact details in a report come only from what
              is visibly published on that page. There is no cold SMS in this product, and you are
              responsible for your own outreach law.
            </p>
            <h3>How do I unlock the full report?</h3>
            <p>
              Buy DealNote once for $49 and you get a licence key. Enter the key on the audit page to unlock
              the full findings, the white-label preview, and the proposal. PDF downloads are coming with
              payment.
            </p>
          </div>
          <p className="mt-32 mb-0">
            <Link href="/audit" className="btn btn-primary">
              <CheckCircle2 size={18} strokeWidth={1.5} aria-hidden /> Try the audit tool
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
