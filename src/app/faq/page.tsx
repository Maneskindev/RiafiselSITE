import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { FAQ } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ", description: "Часті питання про Reafisel." };

export default function FaqPage() {
  return (
    <main className="page">
      <PageHead title="FAQ" text="Не знайшов відповідь? Спитай у стаффу прямо в грі." />
      <div className="faq" data-reveal>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
