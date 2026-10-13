"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

type Status = { online: boolean; players: number; max: number } | null;

// One request per minute shared by every instance on the page.
let cached: Promise<Status> | null = null;
let cachedAt = 0;
function fetchStatus(): Promise<Status> {
  if (!cached || Date.now() - cachedAt > 60_000) {
    cachedAt = Date.now();
    cached = fetch(`https://api.mcsrvstat.us/3/${SITE.ip}`)
      .then((r) => r.json())
      .then((d) => ({ online: !!d.online, players: d.players?.online ?? 0, max: d.players?.max ?? 0 }))
      .catch(() => null);
  }
  return cached;
}

/** Server card with live player count. Click copies the IP. */
export default function ServerStatus({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () => fetchStatus().then((s) => alive && setStatus(s));
    load();
    const id = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.ip); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (compact)
    return (
      <button type="button" className="btn btn-play" onClick={copy}>
        {copied ? "Скопійовано!" : "Грати"}
      </button>
    );

  const state = status === null ? "wait" : status.online ? "on" : "off";
  return (
    <button type="button" className="server" onClick={copy} aria-label={`Скопіювати IP сервера ${SITE.ip}`}>
      <img src="/logo-128.png" alt="" width={64} height={64} />
      <span className="server-body">
        <span className="server-top">
          <b>Reafisel</b>
          <span className="server-count">
            {status?.online ? `${status.players}/${status.max}` : status ? "Офлайн" : "…"}
            <span className="bars" data-state={state}><i /><i /><i /><i /><i /></span>
          </span>
        </span>
        <span className="server-motd">{copied ? "IP скопійовано, до зустрічі в грі!" : SITE.ip}</span>
        <span className="server-hint">{copied ? " " : "Натисни, щоб скопіювати IP"}</span>
      </span>
    </button>
  );
}
