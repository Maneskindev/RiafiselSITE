import type { Metadata } from "next";
import { Gem, PageHead, cssVars } from "@/components/ui";
import { GEMS } from "@/lib/site";

export const metadata: Metadata = { title: "Геми", description: "Усі 8 гемів на Reafisel: пасивки і здібності." };

export default function GemsPage() {
  return (
    <main className="page">
      <PageHead title="Геми" text="Кожен грає з гемом. Пасивки працюють завжди, здібності мають кулдаун. Кілли заряджають гем енергією (до 10), смерті її забирають." />
      <div className="gem-grid">
        {GEMS.map((g) => (
          <article key={g.id} id={g.id} className="gem-card" style={cssVars({ "--c": g.color })} data-reveal>
            <div className="gem-art slot"><Gem id={g.id} size={88} /></div>
            <div>
              <h2>{g.name}</h2>
              <p className="gem-tag">{g.tagline}</p>
              <h3>Пасивки</h3>
              <ul className="gem-passives">{g.passives.map((p) => <li key={p}>{p}</li>)}</ul>
              <h3>Здібності</h3>
              <div className="gem-abilities">{g.abilities.map((a) => <span key={a}>{a}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
