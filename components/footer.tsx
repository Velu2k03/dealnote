import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          <strong>DealNote</strong> is a white-label website teardown and proposal generator for web design
          freelancers and small agencies.
        </p>
        <p>
          <Link href="/audit">Run an audit</Link>
          {" · "}
          <Link href="/sample">Sample report</Link>
          {" · "}
          <Link href="/templates">Proposal templates</Link>
          {" · "}
          <Link href="/terms">Terms, Acceptable Use and Refund policy</Link>
        </p>
        <p className="mb-0">
          $49 one-time. 30 audits per month fair-use limit. Payment coming soon. Reports audit the public
          homepage only. Scores are lab measurements on the run date and can vary between runs.
        </p>
      </div>
    </footer>
  );
}
