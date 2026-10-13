/* eslint-disable @next/next/no-img-element */
import { GEMS } from "@/lib/site";

export const gemColor = (id: string) => GEMS.find((g) => g.id === id)!.color;

export function Gem({ id, size = 32 }: { id: string; size?: number }) {
  return <img className="px" src={`/gems/${id}.png`} alt="" width={size} height={size} loading="lazy" />;
}

export function PageHead({ title, text }: { title: string; text?: string }) {
  return (
    <header className="page-head">
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </header>
  );
}

export const cssVars = (v: Record<string, string | number>) => v as React.CSSProperties;
