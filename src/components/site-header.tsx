"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./logo";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3 border-b border-white/10 shadow-2xl backdrop-blur-xl bg-ink/80" : "py-5 bg-gradient-to-b from-abyss/90 via-abyss/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo size="md" />
        </Link>

        {/* Liens de navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-mist">
          <a href="#modes" className="hover:text-white transition-colors">Modes</a>
          <a href="#programme" className="hover:text-white transition-colors">Programme</a>
          <a href="#offres" className="hover:text-white transition-colors">Offres</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-live"></span>
            </span>
            <span>En direct · 08h–11h & 18h–21h</span>
          </div>

          <Link
            href="/reserver"
            className="btn btn-primary !min-h-[44px] !py-2 !px-5 !text-sm !rounded-xl shadow-[0_0_20px_rgba(255,0,80,0.35)] hover:shadow-[0_0_30px_rgba(255,0,80,0.6)] transition-all"
          >
            ⚡ Réserver
          </Link>
        </div>
      </div>
    </header>
  );
}
