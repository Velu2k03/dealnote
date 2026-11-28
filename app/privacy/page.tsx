export default function PrivacyPage() {
  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="reading fade-in">
          <h1>Privacy Policy</h1>
          <p className="caption">Last updated: 28 Nov 2026. This page is general information, not legal advice.</p>

          <div className="card mt-16" style={{ background: "#F8FAFC" }}>
            <p className="mb-0"><strong>Summary:</strong></p>
            <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
              <li>No accounts in v1, so no account information is collected.</li>
              <li>Your brand profile, tracker, and licence key stay only in your own browser.</li>
              <li>Vercel logs requests to run the service. One third-party script, the Ship or Die hackathon tracker, counts visits.</li>
              <li>No payment is taken today. Payments, when live, will be handled by Polar.</li>
            </ul>
          </div>

          <h2>Who operates DealNote</h2>
          <p>
            DealNote is operated by Velu Murugan, trading as DrVelu, based in Santa Rosa City, Laguna,
            Philippines. Contact:{" "}
            <a href="mailto:murugan@drvelu.com">murugan@drvelu.com</a>.
          </p>

          <h2>What is collected</h2>
          <p>
            <strong>No accounts.</strong> DealNote has no accounts in v1, so it collects no account
            information, no usernames, and no passwords.
          </p>
          <p>
            <strong>Your brand profile and outreach tracker.</strong> When you type in your brand details
            (brand name, contact name, email, phone, website, colours, logo, call to action) or track a
            proposal, that information is stored only in your own browser&apos;s local storage, under the
            keys <code>dealnote-brand-v1</code> and <code>dealnote-proposals-v1</code>. It is never sent to
            DealNote or to anyone else. Your licence key, if you enter one, is stored the same way, in your
            own browser only.
          </p>
          <p>
            <strong>Vercel server logs.</strong> DealNote is hosted by Vercel. When you visit the site or
            run an audit, Vercel logs the request as needed to operate and secure the service: IP address,
            user agent, path, timestamp, and the audited URL in the audit request. Retention follows
            Vercel&apos;s current plan. Serverless functions run in Vercel&apos;s default region,
            Washington, D.C., USA (iad1); static files are served from Vercel&apos;s global CDN.
          </p>
          <p>
            <strong>No cookies in v1.</strong> DealNote sets no cookies.
          </p>
          <p>
            <strong>One third-party script: the Ship or Die hackathon traffic tracker.</strong> The site
            loads no analytics, no advertising tracker, and no other third-party script. The one exception
            is the Ship or Die hackathon traffic tracker, installed 27 Nov 2026. It loads{" "}
            <code>https://www.ship-or-die.com/hackathon/verify.js</code> and counts visits to verify
            traffic for the Ship or Die $100K Hackathon.
          </p>
          <p>
            <strong>Payments.</strong> Payments are coming soon and will be handled by Polar, the merchant of
            record. When payment goes live, Polar will collect the buyer&apos;s name, email, card details,
            and billing address at checkout. DealNote never collects or sees card data. No payment is
            taken today.
          </p>

          <h2>What is NOT collected</h2>
          <p>
            DealNote collects no personal data about the prospects you audit. The audit reads a public
            homepage and records measurements only. DealNote builds no lists of businesses, sells no
            personal information, shares no personal information for advertising, and collects no
            children&apos;s data. This service is for adults 18 or over, or the age of majority where you live.
          </p>

          <h2>Why each item is used</h2>
          <p>
            Your brand profile is used to show your brand on your own reports, on your own device. The
            outreach tracker is used so you can track the proposals you send, on your own device. Vercel
            server logs are used to operate the audit, keep the service running, and prevent abuse. When payment goes live, payment
            details collected by Polar will be used to take and record your payment.
          </p>

          <h2>Who data is shared with</h2>
          <p>
            Data is shared with Vercel (hosting) only today; when payment goes live, payment details will
            also be shared with Polar (payments), for the purposes above. There is no other sharing,
            and no sale of personal information.
          </p>

          <h2>How to delete your data</h2>
          <p>
            To delete your brand profile, outreach tracker, and licence key, clear this site&apos;s data in
            your browser settings (local storage). For log-deletion requests, email{" "}
            <a href="mailto:murugan@drvelu.com">murugan@drvelu.com</a>.
          </p>

          <h2>International transfers</h2>
          <p>
            DealNote is hosted by Vercel. Requests and logs may be processed in the locations where Vercel
            operates its hosting.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We will update this page and the date above when anything changes, including when any new
            third-party script is added. The Ship or Die tracker is now installed (27 Nov 2026).
          </p>
        </div>
      </div>
    </section>
  );
}
