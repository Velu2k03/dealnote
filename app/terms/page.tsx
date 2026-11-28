export default function TermsPage() {
  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="reading">
          <h1>Terms, Acceptable Use, and Refund policy</h1>
          <p className="caption">Last updated: 28 Nov 2026. This text is general information, not legal advice.</p>

          <h2>What DealNote is</h2>
          <p>
            DealNote is a tool for web design freelancers and small agencies. You paste a public business
            website URL, and DealNote fetches that public homepage, checks it, and produces a white-label
            teardown report plus a proposal draft under your brand. Price: $49 one-time. No subscription. No
            per-report fee. Fair-use limit: 30 audits per month per buyer. That limit is a fair-use
            limit, enforced on a best-effort basis: usage is counted per licence key, and the count is
            durable once the Upstash Redis store is configured; until then it may reset when the hosting
            restarts. Lifetime means the lifetime of the product. If DealNote is discontinued, lifetime
            access ends with it, and the refund rule below applies to purchases made within the preceding
            14 days.
          </p>
          <p>
            You can buy DealNote from the Buy button on the home page and the audit page. You get a licence
            key, which you enter on the audit page to unlock the full report, the white-label preview, and
            the proposal. Until payment is connected, the audit tool and the sample report are free to try,
            and full paid PDF downloads are not yet available.
          </p>
          <p>
            This service is for adults 18 or over, or the age of majority where you live.
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
            If a report is bad, report it within 14 days of the run date shown on the report and we will
            replace it or refund the $49, our choice. A bad report is one with a wrong finding, for example
            a check that contradicts the fetched page. To report it, email{" "}
            <a href="mailto:murugan@drvelu.com?subject=DealNote%20refund%20request">murugan@drvelu.com</a> with (1) the report URL, (2) the
            finding you say is wrong, and (3) why it is wrong. We will reply within 3 business days.
            Refunds are for bad reports, not for a prospect declining your proposal, and not for a report
            you have not read. If a feature you paid for stops working, report it the same way and the same
            rule applies.
          </p>

          <h2>Contact</h2>
          <p>
            Email <a href="mailto:murugan@drvelu.com">murugan@drvelu.com</a> for refund requests, bad
            reports, and questions about these terms. There is no phone support in v1. We aim to reply
            within 3 business days.
          </p>

          <h2>Acceptable use</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li>Audit public websites only. Do not use the tool on pages behind a login, a paywall, or a captcha, and do not try to bypass one.</li>
            <li>Respect robots.txt. Do not use the tool on a page the site&apos;s robots.txt asks automated tools not to fetch, and do not try to work around that.</li>
            <li>Do not use the tool to collect personal data. Contact details in a report come only from what is visibly published on the fetched page.</li>
            <li>Do not use the tool to build lists of businesses or to resell data.</li>
            <li>Do not misrepresent a report. Do not add invented figures, invented traffic or revenue claims, or invented testimonials to a report.</li>
            <li>Respect the 30 audits per month fair-use limit.</li>
          </ul>

          <h2>Your outreach is your responsibility</h2>
          <p>
            You are responsible for your own outreach law, including spam, consent, and local rules where
            you and the recipient operate. DealNote provides no cold SMS scripts anywhere in the product,
            and templates are email only. Do not send a report to a business in a way that breaks the law
            where you operate. In the United States, commercial email must follow the CAN-SPAM Act (honest
            headers and subject line, identification as an advertisement, your postal address, and an opt-out
            honoured within 10 business days). Canada, the UK/EU, and Australia require consent before most
            cold commercial email. Do not rely on the US rule when emailing outside the US. Do not send
            marketing texts unless you already have the recipient&apos;s prior express written consent.
          </p>

          <h2>Data and privacy</h2>
          <p>
            DealNote collects no account or payment information in v1. Your brand profile and outreach
            tracker are stored only in your browser&apos;s local storage and are never sent to us. When you
            run an audit, our host (Vercel) logs the request as needed to operate and secure the service.
            We do not collect personal data about the prospects you audit, we do not build or sell lists of
            businesses, and we do not sell personal information. See our{" "}
            <a href="/privacy">Privacy Policy</a> for the full notice.
          </p>

          <h2>Your brand and your content</h2>
          <p>
            Your brand profile, logo, and proposal text are yours. Reports you generate carry your brand
            only. DealNote does not put its name on client reports. In v1, your brand profile is stored only
            in your own browser.
          </p>

          <h2>Changes</h2>
          <p>
            The product is new and will change. Features listed as coming soon, including paid PDF downloads,
            are not promised for a specific date. If a feature you paid for stops working,
            report it and the refund rule above applies.
          </p>
        </div>
      </div>
    </section>
  );
}
