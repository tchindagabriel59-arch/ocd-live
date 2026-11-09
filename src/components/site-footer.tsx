import Link from "next/link";
import { MapPin, MessageCircle, ShieldCheck, Clock3 } from "lucide-react";
import { Logo } from "./logo";
import { BRAND, WINDOWS } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-ink/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size="lg" />
          <p className="text-mist mt-4 max-w-xs text-sm leading-relaxed">
            La plateforme de live shopping qui transforme ton téléphone en
            caisse enregistreuse. Studio pro à Lomé, Hub ouvert à toute
            l&rsquo;Afrique.
          </p>
          <p className="mt-4 text-[11px] tracking-wide text-white/35 uppercase">
            {BRAND.name} · {BRAND.company} — fondé par {BRAND.founder}
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-neon">Navigation</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><a href="/#modes" className="transition hover:text-white">Les 2 modes</a></li>
            <li><a href="/#programme" className="transition hover:text-white">Programme du jour</a></li>
            <li><a href="/#offres" className="transition hover:text-white">Offres &amp; tarifs</a></li>
            <li><Link href="/reserver" className="transition hover:text-white">Réserver un live</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-mag">Horaires live</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {WINDOWS.map((w) => (
              <li key={w.id} className="flex items-center gap-2">
                <Clock3 className="text-neon size-3.5" />
                {w.label} · {w.range}
              </li>
            ))}
            <li className="text-white/40">7 jours sur 7 (GMT)</li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-white/70">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MapPin className="size-3.5 text-white/40" />
              Studio OCD · {BRAND.studioCity}
            </li>
            <li>
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neon flex items-center gap-2 transition"
              >
                <MessageCircle className="size-3.5 text-white/40" />
                {BRAND.whatsappDisplay}
              </a>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:text-mag flex items-center gap-2 text-white/50 transition"
              >
                <ShieldCheck className="size-3.5" />
                Console {BRAND.founder}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-[11px] text-white/35 sm:px-6">
          <span>© 2026 {BRAND.name} · {BRAND.company}. Tous droits réservés.</span>
          <span>Fait avec exigence à Lomé</span>
        </div>
      </div>
    </footer>
  );
}
