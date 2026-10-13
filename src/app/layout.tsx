import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import "./globals.css";

const body = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-body", display: "swap" });
const display = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap", weight: ["500", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Reafisel · Minecraft PvP з гемами", template: "%s · Reafisel" },
  description: `Free-For-All PvP з 8 гемами, дуелями, аірдропами, кейсами й ротацією арен. Заходь на ${SITE.ip}.`,
  openGraph: {
    title: "Reafisel",
    description: `Minecraft PvP з силами гемів. Заходь на ${SITE.ip}`,
    url: SITE.url,
    siteName: "Reafisel",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#07060d", colorScheme: "dark" };

// Runs before first paint: the intro plays on every full load of the home page (not for deep links or reduced motion).
const introScript = `(function(){var d=document.documentElement;
var on=location.pathname==='/'&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
d.dataset.intro=on?'playing':'done';if(on){history.scrollRestoration='manual';scrollTo(0,0)}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
