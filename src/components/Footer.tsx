import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-128.png" alt="" width={48} height={48} loading="lazy" />
        <div>
          <b>Reafisel</b>
          <span>{SITE.ip}</span>
        </div>
      </div>
      <nav className="footer-links" aria-label="Футер">
        <Link href="/gems/">Геми</Link>
        <Link href="/arenas/">Арени</Link>
        <Link href="/ranks/">Ранги</Link>
        <Link href="/rules/">Правила</Link>
        <Link href="/faq/">FAQ</Link>
      </nav>
      <p className="footer-legal">© {new Date().getFullYear()} Reafisel. Не пов'язано з Mojang AB чи Microsoft.</p>
    </footer>
  );
}
