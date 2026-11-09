import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Globe,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tv,
} from "lucide-react";
import Hero from "@/components/home/hero";
import Reveal from "@/components/reveal";
import Logo from "@/components/logo";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { fmtOffersGroups } from "@/lib/sections-data";
import { BRAND, WINDOWS } from "@/lib/catalog";

export default function HomePage() {
  const { presentiel, distance } = fmtOffersGroups();

  return (
    <div className="min-h-screen bg-abyss text-slate-100 overflow-x-hidden">
      <SiteHeader />

      <main>
        {/* HERO SECTION */}
        <Hero />

        {/* MARQUEE BANNER */}
        <section className="border-y border-white/10 bg-panel/80 py-4 overflow-hidden mask-fade-x">
          <div className="flex w-[200%] animate-marquee gap-8 items-center font-display text-xs sm:text-sm uppercase tracking-widest font-600 text-mist">
            {[1, 2].map((k) => (
              <div key={k} className="flex shrink-0 items-center gap-8">
                <span>🔴 Live Shopping Afrique</span>
                <span className="text-neon">✦ Studio pro Lomé</span>
                <span> Hub Vendeuses à distance</span>
                <span className="text-mag">✦ Audiences engagées</span>
                <span> Conversion instantanée</span>
                <span className="text-aqua">✦ Flooz & TMoney</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2 MODES DE RESA */}
        <section id="modes" className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-700 tracking-widest text-neon uppercase">Deux façons de participer</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-800 text-grad">
              Au studio ou depuis ton propre pays
            </h2>
            <p className="mt-4 text-mist text-base sm:text-lg">
              Une infrastructure complète taillée pour les commerçantes et marques africaines.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Carte Studio Presentiel */}
            <Reveal delay={0.1}>
              <div className="glass edge-top rounded-3xl p-8 flex flex-col justify-between h-full hover:border-neon/40 transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/10 text-neon">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-neon/20 px-3 py-1 text-xs font-semibold text-neon">
                      Lomé, Togo
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-700 text-white">Au Studio Pro</h3>
                  <p className="mt-3 text-mist text-sm leading-relaxed">
                    Viens tourner ton live dans nos locaux équipés (caméras 4K, ring lights, micros pros, régie en direct). Session de 1h30 accompagnée.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-neon" /> Équipement broadcast complet</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-neon" /> Assistance régie & modération</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-neon" /> Encaissement direct des ventes</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-mist">À partir de</span>
                    <div className="font-display text-xl font-700 text-white">15 000 XOF</div>
                  </div>
                  <Link href="/reserver?mode=presentiel" className="btn btn-neon !py-2.5 !px-5 !text-sm">
                    Réserver Studio <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Carte Distance */}
            <Reveal delay={0.2}>
              <div className="glass edge-top rounded-3xl p-8 flex flex-col justify-between h-full hover:border-mag/40 transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mag/10 text-mag">
                      <Globe className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-mag/20 px-3 py-1 text-xs font-semibold text-mag">
                      Toute l&apos;Afrique
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-700 text-white">À Distance (Hub)</h3>
                  <p className="mt-3 text-mist text-sm leading-relaxed">
                    Depuis le Cameroun, Bénin, Tchad, Côte d&apos;Ivoire... Transmets ton flux et passe en direct sur l&apos;audience OCD Live.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mag" /> Diffusion multi-plateforme</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mag" /> Validation de lien de live express</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mag" /> Hub Afrique interconnecté</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-mist">À partir de</span>
                    <div className="font-display text-xl font-700 text-white">2 500 XOF</div>
                  </div>
                  <Link href="/reserver?mode=distance" className="btn btn-primary !py-2.5 !px-5 !text-sm">
                    Rejoindre le Hub <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION PROGRAMME ET SLOTS */}
        <section id="programme" className="bg-panel/40 py-24 border-y border-white/5">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <Reveal>
                <span className="text-xs font-700 tracking-widest text-mag uppercase">Fenêtres de live quotidiennes</span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-800 text-white">
                  Des heures de grande écoute réservées pour toi
                </h2>
                <p className="mt-4 text-mist leading-relaxed">
                  Chaque jour, 4 créneaux de 1h30 sont ouverts pour maximiser l&apos;engagement des acheteurs en Afrique de l&apos;Ouest et Centrale.
                </p>

                <div className="mt-8 space-y-4">
                  {WINDOWS.map((w, idx) => (
                    <div key={w.label} className="glass rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-neon font-display font-700">
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-display font-700 text-white">{w.label}</h4>
                          <span className="text-xs text-mist">GMT / Heure de Lomé</span>
                        </div>
                      </div>
                      <span className="rounded-xl bg-white/10 px-4 py-2 font-display text-sm font-700 text-neon">
                        {w.range}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.2} className="relative">
                <div className="glass edge-top rounded-3xl p-8 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex items-center gap-2 text-xs font-semibold text-live">
                      <span className="live-dot" /> EN STUDIO MAINTENANT
                    </span>
                    <span className="text-xs text-mist">56 créneaux / 14 jours</span>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <Image
                      src="https://images.pexels.com/photos/7676406/pexels-photo-7676406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Studio Live Streaming"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                      <div>
                        <div className="font-display text-lg font-700 text-white">Studio Lomé · Plateau A</div>
                        <p className="text-xs text-slate-300">Session en direct · Éclairage RGB pro</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION OFFRES */}
        <section id="offres" className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-700 tracking-widest text-neon uppercase">Tarifs transparents</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-800 text-grad">
              Choisis ton pass & lance ton live
            </h2>
          </Reveal>

          {/* Offres Présentiel */}
          <div className="mt-16">
            <h3 className="font-display text-xl font-700 text-white mb-8 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neon" /> Offres Studio Présentiel (Lomé)
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {presentiel.map((o, i) => (
                <Reveal key={o.id} delay={i * 0.1}>
                  <div className={`glass rounded-3xl p-6 flex flex-col justify-between h-full border ${o.popular ? "border-neon bg-neon/5" : "border-white/10"}`}>
                    <div>
                      {o.popular && (
                        <span className="mb-4 inline-block rounded-full bg-neon/20 px-3 py-1 text-xs font-bold text-neon uppercase">
                          ★ Le plus populaire
                        </span>
                      )}
                      <h4 className="font-display text-xl font-700 text-white">{o.name}</h4>
                      <div className="mt-4 font-display text-3xl font-800 text-grad">{o.priceLabel}</div>
                    </div>
                    <Link href={`/reserver?mode=presentiel&offer=${o.id}`} className="mt-8 btn btn-neon w-full">
                      Réserver
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Offres Distance */}
          <div className="mt-20">
            <h3 className="font-display text-xl font-700 text-white mb-8 flex items-center gap-2">
              <Globe className="h-5 w-5 text-mag" /> Offres Hub à Distance (Afrique)
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {distance.map((o, i) => (
                <Reveal key={o.id} delay={i * 0.1}>
                  <div className={`glass rounded-3xl p-6 flex flex-col justify-between h-full border ${o.popular ? "border-mag bg-mag/5" : "border-white/10"}`}>
                    <div>
                      {o.popular && (
                        <span className="mb-4 inline-block rounded-full bg-mag/20 px-3 py-1 text-xs font-bold text-mag uppercase">
                          ★ Recommandé Hub
                        </span>
                      )}
                      <h4 className="font-display text-xl font-700 text-white">{o.name}</h4>
                      <div className="mt-4 font-display text-3xl font-800 text-grad-live">{o.priceLabel}</div>
                    </div>
                    <Link href={`/reserver?mode=distance&offer=${o.id}`} className="mt-8 btn btn-primary w-full">
                      Souscrire
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-gradient-to-br from-panel via-abyss to-ink py-24 border-t border-white/10">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <Logo size="lg" />
              <h2 className="mt-6 font-display text-3xl sm:text-5xl font-800 text-white">
                Prête à propulser tes ventes en direct ?
              </h2>
              <p className="mt-4 text-mist text-lg">
                Rejoins des dizaines de vendeuses qui génèrent des résultats exceptionnels sur OCD Live.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/reserver" className="btn btn-primary !px-10 !py-4 !text-base">
                  Réserver ma session maintenant
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
