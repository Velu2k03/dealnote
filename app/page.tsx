import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Globe, Send } from "lucide-react";
import { sampleAudit } from "@/lib/audit";
import { IssueList, ScoreSummary } from "@/components/audit-ui";

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
              <h1>Paste any business website URL. Get a teardown report plus a ready-to-send proposal in about a minute.</h1>
              <p style={{ color: "#475569" }}>
                Show the prospect what is wrong with their site, then sell the fix. The report carries your
                brand, your logo, and your contact details, not ours.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/audit" className="btn btn-primary">
                  Run a free audit <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
                </Link>
                <Link href="/sample" className="btn btn-secondary">
                  See a sample report
                </Link>
              </div>
              <p className="caption mt-24">
                $49 one-time. No subscription. No per-report fee. 30 audits per month fair-use limit.
                Payment coming soon.
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
          <div className="steps-grid mt-24">
            <div className="card">
              <Globe size={18} strokeWidth={1.5} color="#0F766E" aria-hidden />
              <h3 className="mt-16">1. Paste a URL</h3>
              <p className="mb-0">
                Paste the prospect&apos;s website address. DealNote fetches the public homepage and checks
                speed, mobile, SEO, technical health, conversion, and trust signals.
              </p>
            </div>
            <div className="card">
              <FileText size={18} strokeWidth={1.5} color="#0F766E" aria-hidden />
              <h3 className="mt-16">2. Get the teardown</h3>
              <p className="mb-0">
                Every finding shows what was found, why it matters in plain language, and the fix in one
                line. Scores use A to F grades, with the weights printed on the report.
              </p>
            </div>
            <div className="card">
              <Send size={18} strokeWidth={1.5} color="#0F766E" aria-hidden />
              <h3 className="mt-16">3. Send the proposal</h3>
              <p className="mb-0">
                The findings become a What I Would Fix list with blank price placeholders you fill in. Send
                the teardown to open the conversation, and the proposal when they reply.
              </p>
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
            Read the full sample report <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container">
          <h2>Pricing</h2>
          <div className="card mt-24" style={{ maxWidth: 560 }}>
            <p className="eyebrow">One-time payment</p>
            <p style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, margin: "0 0 8px" }} className="tabular">
              $49
            </p>
            <p>One payment. No subscription. No per-report fee.</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>30 audits per month fair-use limit</li>
              <li>White-label reports under your brand</li>
              <li>Teardown PDF and proposal PDF</li>
              <li>Proposal templates included</li>
            </ul>
            <p className="caption">
              $49 once is less than two months of the cheapest white-label audit subscription at $39 per
              month. Arithmetic on published prices, not an earnings claim. No guarantee of client wins.
            </p>
            <p className="mb-0">
              <span className="tag">Payment coming soon</span>. The audit tool on this page is free to try
              in v1, and full PDF downloads arrive when payment is wired up.
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
              Yes. One payment of $49, no subscription, no per-report fee. The fair-use limit is 30 audits
              per month. Lifetime means the lifetime of the product, as stated in the terms.
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
              Report a bad report within 14 days and we will replace it or refund it. See the refund
              section in the terms.
            </p>
            <h3>Does DealNote collect personal data about the prospect?</h3>
            <p>
              No. The audit reads the public homepage only. Contact details in a report come only from what
              is visibly published on that page. There is no cold SMS in this product, and you are
              responsible for your own outreach law.
            </p>
            <h3>Why is payment coming soon?</h3>
            <p>
              This is v1. You can run audits and preview the sample report now. Full paid PDF downloads
              arrive when payment is wired up.
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
