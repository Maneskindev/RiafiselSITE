"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fades [data-reveal] elements in the first time they scroll into view. Re-scans on every page change. */
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
