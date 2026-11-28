import Link from "next/link";
import { CheckCircle2, ChevronDown, FileText, Globe, Send } from "lucide-react";
import { sampleAudit } from "@/lib/audit";
import { BuyButton, IssueList, ScoreSummary } from "@/components/audit-ui";
import { Reveal, SpotlightCard } from "@/components/motion-ui";
import { SakugaButton, SakugaTooltip } from "@/components/sakuga";

export default function Home() {
  const sample = sampleAudit();
  const topIssues = sample.issues.slice(0, 3);

  return (
    <>
      <section style={{ paddingTop: "4rem" }}>
        <div className="container">
          <div className="hero-grid">
            <Reveal>
            <div>
              <p className="eyebrow">For web design freelancers and small agencies</p>
              <h1>Show the prospect what is wrong with their site, then sell the fix.</h1>
              <p style={{ color: "#4A3B5C" }}>
                Paste any business website URL. In about a minute you get a white-label teardown report plus
                a ready-to-send proposal, scored across speed, mobile, SEO, technical health, conversion,
                and trust, under your own brand, logo, and contact details, not ours.
              </p>
              <form method="get" action="/audit" style={{ display: "flex", gap: 0, flexWrap: "nowrap", border: "1px solid #C4B5FD", borderRadius: "0.75rem", overflow: "hidden", background: "#fff" }}>
                <input
                  name="url"
                  type="url"
                  required
                  aria-label="Business website URL"
                  placeholder="https://www.example-plumbing.com"
                  style={{ flex: "1 1 auto", border: "none", minWidth: 0 }}
                />
                <SakugaButton type="submit" className="hero-submit">
                  Run a free audit
                </SakugaButton>
              </form>
              <p className="mt-16 mb-0">
                <Link href="/sample">See a sample report</Link>
              </p>
              <p className="caption mt-24">
                $49 one-time, with no subscription and no per-report fee.{" "}
                <SakugaTooltip
                  label="What fair-use means"
                  text="30 audits a month per license key, on a rolling monthly basis. The free audit shows the score, grade, and top 2 findings; the full report unlocks with a license key."
                />
              </p>
              <p className="mt-16 mb-0">
                <a href="#how-it-works" className="caption" style={{ display: "inline-flex", gap: "0.375rem", alignItems: "center" }}>
                  <ChevronDown size={16} strokeWidth={1.5} aria-hidden /> See how it works below
                </a>
              </p>
            </div>
            </Reveal>
            <Reveal delay={0.08}>
            <div className="hero-score">
              <ScoreSummary result={sample}>
                <p className="mt-16 mb-0"><span className="sample-stamp">SAMPLE: fictional business</span></p>
              </ScoreSummary>
              <p className="caption mt-16">
                This is the real audit layout, filled with fictional data for a fictional business. The
                sample report page shows the full version.
              </p>
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ background: "#FAF5FF", borderTop: "1px solid #E9D5FF", borderBottom: "1px solid #E9D5FF" }}>
        <div className="container">
          <h2>How it works</h2>
          <div className="steps-flow mt-24">
            <div className="step-row glass">
              <span className="step-num" aria-hidden>1</span>
              <div>
                <h3 className="mt-0" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Globe size={18} strokeWidth={1.5} color="#4A3B5C" aria-hidden /> Paste a URL
                </h3>
                <p className="mb-0">
                  Paste the prospect&apos;s website address. DealNote fetches the public homepage and checks
                  speed, mobile, SEO, technical health, conversion, and trust signals.
                </p>
              </div>
            </div>
            <div className="step-row glass">
              <span className="step-num" aria-hidden>2</span>
              <div>
                <h3 className="mt-0" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <FileText size={18} strokeWidth={1.5} color="#4A3B5C" aria-hidden /> Get the teardown
                </h3>
                <p className="mb-0">
                  Every finding shows what was found, why it matters in plain language, and the fix in one
                  line. Scores use A to F grades, with the weights printed on the report.
                </p>
              </div>
            </div>
            <div className="step-row glass">
              <span className="step-num" aria-hidden>3</span>
              <div>
                <h3 className="mt-0" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Send size={18} strokeWidth={1.5} color="#4A3B5C" aria-hidden /> Send the proposal
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

      <section style={{ background: "#FAF5FF", borderTop: "1px solid #E9D5FF", borderBottom: "1px solid #E9D5FF" }}>
        <div className="container">
          <h2>Pricing</h2>
          <SpotlightCard className="card glass mt-24" >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }} className="pricing-grid">
            <div>
            <p style={{ fontSize: "3rem", fontWeight: 600, lineHeight: 1, margin: "0 0 0.5rem" }} className="tabular">
              $49
            </p>
            <p>One payment of $49, with no subscription and no per-report fee.</p>
            <p className="mb-16">
              <BuyButton />
            </p>
            <p className="caption">
              $49 once is less than two months of a $39-per-month subscription (SEOptimer White Label,
              $39/mo, $468 over 12 monthly payments, checked 28 Nov 2026). Example only. Compare current
              prices before you buy. No guarantee of client wins.
            </p>
            <p className="caption">
              Bad report? Report it within 14 days for a replacement or refund. Email{" "}
              <a href="mailto:murugan@drvelu.com?subject=DealNote%20refund%20request">murugan@drvelu.com</a>{" "}
              with the report URL, the finding, and why. See the refund section in the terms.
            </p>
            <p className="caption mb-0">
              The audit tool is free to try. Full reports and PDF downloads unlock with a license key.
            </p>
            </div>
            <div>
            <p className="mb-16">Everything below is included in the one payment.</p>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 0 }}>
              <li style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <CheckCircle2 size={18} strokeWidth={1.5} color="#be185d" aria-hidden style={{ flexShrink: 0, marginTop: "0.1875rem" }} />
                <span>30 audits a month fair-use limit, about $1.63 per audit</span>
              </li>
              <li style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <CheckCircle2 size={18} strokeWidth={1.5} color="#be185d" aria-hidden style={{ flexShrink: 0, marginTop: "0.1875rem" }} />
                <span>White-label reports under your brand</span>
              </li>
              <li style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <CheckCircle2 size={18} strokeWidth={1.5} color="#be185d" aria-hidden style={{ flexShrink: 0, marginTop: "0.1875rem" }} />
                <span>Teardown PDF and proposal PDF included with your license</span>
              </li>
              <li style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", marginBottom: 0 }}>
                <CheckCircle2 size={18} strokeWidth={1.5} color="#be185d" aria-hidden style={{ flexShrink: 0, marginTop: "0.1875rem" }} />
                <span>Proposal templates included</span>
              </li>
            </ul>
            </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>What DealNote checks, and what it does not</h2>
          <div className="two-col mt-24">
            <div className="card glass">
              <h3>It checks the page you paste</h3>
              <ul style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
                <li>Speed, measured in the run, plus page weight</li>
                <li>Mobile viewport and tap-to-call links</li>
                <li>Title, meta description, headings, image alt text</li>
                <li>HTTPS, canonical, robots.txt, sitemap, broken links</li>
                <li>Calls to action, phone visibility, forms</li>
                <li>LocalBusiness schema, social links, favicon</li>
              </ul>
            </div>
            <div className="card glass">
              <h3>It does not estimate or guess</h3>
              <ul style={{ paddingLeft: "1.25rem", marginBottom: 0 }}>
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

      <section style={{ background: "#FAF5FF", borderTop: "1px solid #E9D5FF" }}>
        <div className="container">
          {/* Neon P2-1 (28 Nov 2026): the heading lives in the same
              centered 47.5rem column as the FAQ items, not left-aligned
              at the container edge while the items sit centered. */}
          <div className="reading" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h2>Frequently asked questions</h2>
          <div className="mt-24">
            <h3>Is the $49 really one-time?</h3>
            <p>
              Yes. You pay $49 once, with no subscription and no per-report fee. The fair-use limit is
              stated on the pricing card above and in the terms. Lifetime means the lifetime of the product,
              as stated in the terms.
            </p>
            <h3>Does the client see the DealNote name?</h3>
            <p>
              No. Reports carry your brand name, logo, colors, and contact details. The DealNote name
              appears only in this app and on the sample report, which is labeled as a sample.
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
              Buy DealNote once for $49 and you get a license key. Enter the key on the audit page to unlock
              the full findings, the white-label preview, and the proposal. PDF downloads are included
              with your license.
            </p>
            <h3>What if I lose my license key?</h3>
            <p>
              Your license key is in the receipt email Lemon Squeezy sends after you buy, and on your
              Lemon Squeezy My Orders page. If you cannot find it, email{" "}
              <a href="mailto:murugan@drvelu.com?subject=DealNote%20license%20key%20recovery">murugan@drvelu.com</a>{" "}
              from the email you bought with and we will resend it.
            </p>
          </div>
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
