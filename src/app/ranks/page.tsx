import type { Metadata } from "next";
import { Gem, PageHead, cssVars } from "@/components/ui";
import { RANKS } from "@/lib/site";

export const metadata: Metadata = { title: "Ранги", description: "Ранги Reafisel та їхні бонуси." };

export default function RanksPage() {
  return (
    <main className="page">
      <PageHead title="Ранги" text="Ранги діють на всіх серверах мережі, і кожен включає все з попередніх." />
      <div className="rank-grid">
        {RANKS.map((r) => (
          <article key={r.name} className="rank" style={cssVars({ "--c": r.color })} data-reveal>
            <div className="rank-head"><span className="slot"><Gem id={r.gem} size={36} /></span><h2>{r.name}</h2></div>
            <ul>{r.perks.map((p) => <li key={p}>{p}</li>)}</ul>
            {r.note && <p className="rank-note">{r.note}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
