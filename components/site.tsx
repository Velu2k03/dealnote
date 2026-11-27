import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="wordmark" aria-label="DealNote home">
          <Image src="/logo.svg" alt="" width={28} height={28} />
          DealNote
        </Link>
        <nav aria-label="Main">
          <Link href="/audit">Run an audit</Link>
          <Link href="/sample">Sample report</Link>
          <Link href="/templates">Proposal templates</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </header>
  );
}
