import Link from "next/link";
import { BuyButton } from "@/components/audit-ui";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          <strong>DealNote</strong> is a white-label website teardown and proposal generator for web design
          freelancers and small agencies.
        </p>
        <nav aria-label="Footer">
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <li><Link href="/audit">Run an audit</Link></li>
            <li><Link href="/sample">Sample report</Link></li>
            <li><Link href="/templates">Proposal templates</Link></li>
            <li><Link href="/terms">Terms, Acceptable Use and Refund policy</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><a href="mailto:murugan@drvelu.com">Contact: murugan@drvelu.com</a></li>
          </ul>
        </nav>
        <p>
          $49 one-time. Reports audit the public homepage only. Scores are lab measurements on the run date and can vary between runs.
        </p>
        <p>
          DealNote is made by Velu Murugan (DrVelu), Santa Rosa City, Laguna, Philippines. Last updated
          28 Nov 2026.
        </p>
        <p className="mb-0">
          <BuyButton />
        </p>
      </div>
    </footer>
  );
}
