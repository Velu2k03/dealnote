export default function TermsPage() {
  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="reading">
          <p className="eyebrow">Terms</p>
          <h1>Terms, Acceptable Use, and Refund policy</h1>
          <p className="caption">Last updated: 27 Nov 2026. This text is general information, not legal advice.</p>

          <h2>What DealNote is</h2>
          <p>
            DealNote is a tool for web design freelancers and small agencies. You paste a public business
            website URL, and DealNote fetches that public homepage, checks it, and produces a white-label
            teardown report plus a proposal draft under your brand. Price: $49 one-time. No subscription. No
            per-report fee. Fair-use limit: 30 audits per month per buyer. Lifetime means the lifetime of
            the product.
          </p>
          <p>
            Payment is coming soon in v1. Until payment is wired up, the audit tool and the sample report
            are free to try, and full paid PDF downloads are not yet available.
          </p>

          <h2>What the tool does and does not check</h2>
          <p>
            The tool audits the public homepage only, in v1. It checks speed as measured in the run, mobile
            viewport and tap-to-call links, title, meta description, headings, image alt text, HTTPS,
            canonical, robots.txt, sitemap, broken links, calls to action, phone visibility, forms,
            LocalBusiness schema, social links, and favicon.
          </p>
          <p>
            It does not check traffic, rankings, backlinks, or Google Maps or Places data. It does not
            estimate how much money a business is losing. It does not crawl more than the homepage in v1.
            Accessibility checks are automated checks, not a WCAG certification.
          </p>

          <h2>Data provided as-is</h2>
          <p>
            Reports and scores are provided as-is. Scores are lab measurements on the run date under stated
            conditions, and scores can vary between runs. DealNote does not guarantee that a report is
            complete, that a fix will raise a score by a given amount, or that any prospect will sign as a
            client. There is no guarantee of client wins.
          </p>

          <h2>Refund policy</h2>
          <p>
            If a report is bad, report it within 14 days and we will replace it or refund it. A bad report
            is one with wrong findings, for example a check that contradicts the fetched page. Tell us which
            finding is wrong and why, and we will re-run the audit or refund the $49. Refunds are for bad
            reports, not for a prospect declining your proposal.
          </p>

          <h2>Acceptable use</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li>Audit public websites only. Do not use the tool on pages behind a login, a paywall, or a captcha, and do not try to bypass one.</li>
            <li>Do not use the tool to collect personal data. Contact details in a report come only from what is visibly published on the fetched page.</li>
            <li>Do not use the tool to build lists of businesses or to resell data.</li>
            <li>Do not misrepresent a report. Do not add invented figures, invented traffic or revenue claims, or invented testimonials to a report.</li>
            <li>Respect the 30 audits per month fair-use limit.</li>
          </ul>

          <h2>Your outreach is your responsibility</h2>
          <p>
            You are responsible for your own outreach law, including spam, consent, and local rules where
            you operate. DealNote provides no cold SMS scripts anywhere in the product, and templates are
            email only. Do not send a report to a business in a way that breaks the law where you operate.
          </p>

          <h2>Your brand and your content</h2>
          <p>
            Your brand profile, logo, and proposal text are yours. Reports you generate carry your brand
            only. DealNote does not put its name on client reports. In v1, your brand profile is stored only
            in your own browser.
          </p>

          <h2>Changes</h2>
          <p>
            The product is new and will change. Features listed as coming soon, including payment and paid
            PDF downloads, are not promised for a specific date. If a feature you paid for stops working,
            report it and the refund rule above applies.
          </p>
        </div>
      </div>
    </section>
  );
}
