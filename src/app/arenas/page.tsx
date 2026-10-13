/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { PageHead, cssVars } from "@/components/ui";
import { ARENAS, BASE } from "@/lib/site";

export const metadata: Metadata = { title: "Арени", description: "Чотири арени Reafisel і як працює ротація карт." };

export default function ArenasPage() {
  return (
    <main className="page">
      <PageHead title="Арени" text="Одночасно відкрита одна арена, і вона змінюється кожні 30 хвилин. В останню хвилину будь-хто може проголосувати за наступну карту через /vote." />
      <div className="arena-list">
        {ARENAS.map((a) => (
          <article key={a.id} id={a.id} className="arena-row" style={cssVars({ "--c": a.color })} data-reveal>
            <img className="px" src={`${BASE}/arenas/${a.id}.png`} alt={`${a.name} згори`} width={560} height={560} loading="lazy" />
            <div>
              <h2>{a.name}</h2>
              <p>{a.text}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
