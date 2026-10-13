/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import GemStage from "@/components/GemStage";
import ServerStatus from "@/components/ServerStatus";
import { Gem, cssVars, gemColor } from "@/components/ui";
import { ARENAS, FEATURES, SITE } from "@/lib/site";

export default function Home() {
  return (
    <>
      <GemStage />
      <main>
        <section className="hero">
          <div className="hero-inner">
            <img id="hero-logo" className="hero-logo" src="/logo.webp" alt="Reafisel" width={640} height={640} fetchPriority="high" />
            <h1 className="reveal-intro">Free-for-all PvP з силами гемів</h1>
            <p className="hero-sub reveal-intro">
              8 гемів, 4 арени, які змінюються кожні 30 хвилин, дуелі, аірдропи і кейси.
            </p>
            <div className="reveal-intro"><ServerStatus /></div>
            <div className="hero-actions reveal-intro">
              <Link className="btn btn-play" href="/gems/">Дивитися геми</Link>
              <Link className="btn btn-stone" href="/ranks/">Ранги</Link>
            </div>
            <p className="hero-meta reveal-intro">{SITE.version} · Безкоштовно</p>
          </div>
        </section>

        <section className="section">
          <div className="row-head" data-reveal><h2>Що є на сервері</h2></div>
          <ul className="feature-list" data-reveal>
            {FEATURES.map((f) => (
              <li key={f.title} style={cssVars({ "--c": gemColor(f.icon) })}>
                <span className="slot"><Gem id={f.icon} size={28} /></span>
                <div><b>{f.title}</b><p>{f.text}</p></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <div className="row-head" data-reveal>
            <h2>Арени</h2>
            <Link href="/arenas/" className="more">Про карти →</Link>
          </div>
          <div className="arena-grid">
            {ARENAS.map((a) => (
              <Link key={a.id} href={`/arenas/#${a.id}`} className="arena" style={cssVars({ "--c": a.color })} data-reveal>
                <img className="px" src={`/arenas/${a.id}.png`} alt={`${a.name} згори`} width={560} height={560} loading="lazy" />
                <span className="arena-name">{a.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
