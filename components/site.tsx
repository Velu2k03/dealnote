import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/audit", label: "Run an audit" },
  { href: "/sample", label: "Sample report" },
  { href: "/templates", label: "Proposal templates" },
  { href: "/terms", label: "Terms" },
];

// One <nav> landmark at every size (modern-web-guidance `navbar`): under
// 640px the links live in a native popover opened by a Menu button, so the
// header is one row on a phone instead of three; at wider sizes a separate
// plain list is inline. The two lists must NOT be the same element: a
// closed popover's UA `display: none` is overridden by the author
// `display: flex` that makes the desktop nav inline, so a shared element
// paints as a fixed, black-bordered box in the top layer at desktop width
// (Loop 4 P1-1). Each list is `display: none` at the other size, so only
// one is ever in the layout or the tab order.
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
          <ul className="site-menu site-menu-desktop">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <ul id="site-menu" className="site-menu site-menu-mobile" popover="auto">
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
