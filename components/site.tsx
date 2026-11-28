import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/audit", label: "Run an audit" },
  { href: "/sample", label: "Sample report" },
  { href: "/templates", label: "Proposal templates" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

// One <nav> landmark at every size (modern-web-guidance `navbar`): under
// 640px the links live in a native popover opened by a Menu button, so the
// header is one row on a phone instead of three; at wider sizes the same
// list is inline. No menu roles or arrow-key handling: these are plain
// links, and the popover gives light-dismiss and Escape for free.
export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="wordmark" aria-label="DealNote home">
          <Image src="/logo.svg" alt="" width={28} height={28} />
          DealNote
        </Link>
        <nav aria-label="Main">
          <button
            className="menu-button btn btn-secondary"
            type="button"
            popoverTarget="site-menu"
            aria-controls="site-menu"
          >
            Menu
          </button>
          <ul id="site-menu" className="site-menu" popover="auto">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
