import Link from "next/link";
import Logo from "./logo";
import { BRAND } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-4">
        <div>
          <Logo size="sm" />
          <p className="mt-3 text-sm text-mist">{BRAND.company} · {BRAND.studioCity}</p>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-mist">Plateforme</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/reserver?mode=presentiel" className="hover:text-neon transition-colors">Présentiel</Link></li>
            <li><Link href="/reserver?mode=distance" className="hover:text-neon transition-colors">À distance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-mist">Légal</h4>
          <ul className="space-y-2 text-sm text-mist"><li>CGV</li><li>Confidentialité</li></ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-mist">Contact</h4>
          <p className="text-sm text-mist">WhatsApp: +{BRAND.whatsappNumber}</p>
          <p className="text-sm text-mist">Fondateur: {BRAND.founder}</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-mist/60">
        © {new Date().getFullYear()} {BRAND.name} — {BRAND.company}
      </div>
    </footer>
  );
}

export default SiteFooter;
