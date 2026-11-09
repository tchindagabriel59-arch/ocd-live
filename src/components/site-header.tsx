"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { Zap } from "lucide-react";

/** Header sticky : logo en pièce maîtresse, CTA toujours sous le pouce. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-deep border-b border-white/5"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="OCD Live — accueil" className="py-2">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-medium text-white/60 md:flex">
          <a href="/#modes" className="transition hover:text-white">
            Modes
          </a>
          <a href="/#programme" className="transition hover:text-white">
            Programme
          </a>
          <a href="/#offres" className="transition hover:text-white">
            Offres
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="glass hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white/80 lg:inline-flex">
            <span className="live-dot" />
            En direct · 08h–11h &amp; 18h–21h
          </span>
          <Link
            href="/reserver"
            className="btn btn-primary !min-h-[44px] !rounded-xl px-4 text-[13px] sm:px-5"
          >
            <Zap className="size-4" strokeWidth={2.5} />
            Réserver
          </Link>
        </div>
      </div>
    </header>
  );
}
