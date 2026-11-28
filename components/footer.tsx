import Link from "next/link";
import { BuyButton } from "@/components/audit-ui";

// Footer (28 Nov 2026, Velu: the old footer was one messy block on mobile,
// links running together, and it printed his name and address. Rebuilt
// mobile-first: grouped links with small headings, stacked on a phone,
// columns on desktop via the fluid .footer-grid. No personal info here:
// no name, no alias, no city, no country, no last-updated date. The one
// contact line is the refund and license-key help address named in the
// terms, nothing else.)
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <p>
              <strong>DealNote</strong> is a white-label website teardown and proposal generator for web
              design freelancers and small agencies.
            </p>
            <p className="caption">$49 one-time. No subscription, no per-report fee.</p>
          </div>
          <nav className="footer-group" aria-label="Product">
            <h3>Product</h3>
            <ul>
              <li><Link href="/audit">Run an audit</Link></li>
              <li><Link href="/sample">Sample report</Link></li>
              <li><Link href="/templates">Proposal templates</Link></li>
            </ul>
          </nav>
          <nav className="footer-group" aria-label="Legal">
            <h3>Legal</h3>
            <ul>
              <li><Link href="/terms">Terms, Acceptable Use and Refund policy</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </nav>
          <div className="footer-group">
            <h3>Get DealNote</h3>
            <BuyButton />
          </div>
        </div>
        <div className="footer-note">
          <p>
            Reports audit the public homepage only. Scores are lab measurements on the run date and can
            vary between runs.
          </p>
          <p>
            Refund and license-key help:{" "}
            <a href="mailto:murugan@drvelu.com">murugan@drvelu.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
