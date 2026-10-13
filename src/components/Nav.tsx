"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ServerStatus from "./ServerStatus";
import { BASE } from "@/lib/site";

const LINKS = [
  ["Геми", "/gems/"],
  ["Арени", "/arenas/"],
  ["Ранги", "/ranks/"],
  ["Правила", "/rules/"],
  ["FAQ", "/faq/"],
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="nav reveal-intro">
      <Link href="/" className="nav-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/logo-128.png`} alt="" width={36} height={36} />
        <span>Reafisel</span>
      </Link>
      <nav className={`nav-links${open ? " open" : ""}`} aria-label="Головне меню">
        {LINKS.map(([label, href]) => (
          <Link key={href} href={href} aria-current={path.startsWith(href.slice(0, -1)) ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <div className="nav-cta">
        <ServerStatus compact />
        <button type="button" className="nav-burger" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
      </div>
    </header>
  );
}
