import type { Metadata } from "next";
import { Gem, PageHead, cssVars, gemColor } from "@/components/ui";
import { RULES } from "@/lib/site";

export const metadata: Metadata = { title: "Правила", description: "Правила сервера Reafisel." };

const COLS = [["У грі", "strength", RULES.game], ["Чат", "flux", RULES.chat]] as const;

export default function RulesPage() {
  return (
    <main className="page">
      <PageHead title="Правила" text="За порушення — попередження, мут, кік або бан, залежно від серйозності." />
      <div className="rules">
        {COLS.map(([title, gem, list]) => (
          <section key={title} className="rule-col" style={cssVars({ "--c": gemColor(gem) })} data-reveal>
            <h2><span className="slot"><Gem id={gem} size={28} /></span> {title}</h2>
            <ol>{list.map((r) => <li key={r}>{r}</li>)}</ol>
          </section>
        ))}
      </div>
    </main>
  );
}
