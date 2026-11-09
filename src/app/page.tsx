import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  Check,
  Clock3,
  Globe2,
  MapPin,
  MessageCircle,
  Quote,
  Radio,
  Sparkles,
  Video,
} from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Reveal } from "@/components/reveal";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OFFERS, SLOT_TIMES, WINDOWS, fmtOffersGroups } from "@/lib/sections-data";

const MARQUEE = [
  "Lives 7j/7",
  "08h–11h & 18h–21h GMT",
  "Studio pro · Lomé",
  "Hub Afrique · 12 pays",
  "Dès 2 500 XOF",
  "Reçu instantané",
  "Créneaux de 1h30",
];

const PROCESS = [
  {
    n: "01",
    icon: Radio,
    title: "Choisis ton mode",
    text: "Studio équipé à Lomé, ou ta propre boutique connectée au Hub.",
  },
  {
    n: "02",
    icon: CalendarCheck2,
    title: "Réserve en 2 minutes",
    text: "Calendrier des créneaux, offre, WhatsApp. Rien de plus.",
  },
  {
    n: "03",
    icon: MessageCircle,
    title: "Reçois ta confirmation",
    text: "Reçu instantané + rappel WhatsApp avant ta session live.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        {/* ——— Bandeau défilant ——— */}
        <div className="border-y border-white/5 bg-ink/70 py-3.5">
          <div className="mask-fade-x mx-auto max-w-6xl overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-8 pr-8">
              {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
                <span
                  key={i}
                  aria-hidden={i >= MARQUEE.length}
                  className="flex items-center gap-8 text-[11px] font-semibold tracking-[0.22em] whitespace-nowrap text-white/45 uppercase"
                >
                  {t}
                  <span className="live-dot opacity-70" style={{ width: 5, height: 5 }} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ——— Les deux modes ——— */}
        <section id="modes" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <p className="eyebrow text-neon">Deux façons de passer en direct</p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Un seul objectif : <span className="text-grad">vendre plus, plus vite</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {/* Présentiel — Studio Lomé */}
            <Reveal delay={0.08}>
              <Link
                href="/reserver?mode=presentiel"
                className="group glass-deep edge-top relative block overflow-hidden rounded-[28px] p-6 transition-transform duration-300 active:scale-[0.98] sm:p-8"
              >
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.pexels.com/photos/7676406/pexels-photo-7676406.jpeg?auto=compress&cs=tinysrgb&w=1080"
                    alt="Vendeuse en live au studio OCD — ring light et néons"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent" />
                  <span className="glass absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold">
                    <MapPin className="text-live size-3.5" strokeWidth={2.6} />
                    Présentiel
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold sm:text-2xl">
                  Studio OCD · Lomé
                </h3>
                <p className="text-mist mt-2 text-sm leading-relaxed">
                  Tu arrives avec tes produits, on s&rsquo;occupe de tout le reste :
                  lumière cinéma, régie, décor, et diffusion sur nos audiences.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {["Calendrier des créneaux 1h30", "Équipe régie incluse", "Replay offert pour tes réseaux"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Check className="text-live size-4" strokeWidth={3} /> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    À partir de <span className="font-display text-base font-bold text-white">15 000 XOF</span>
                  </span>
                  <span className="btn btn-primary !min-h-[44px] !rounded-xl px-4 text-[13px]">
                    Réserver
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* Distance — Hub Afrique */}
            <Reveal delay={0.16}>
              <Link
                href="/reserver?mode=distance"
                className="group glass-deep edge-top relative block overflow-hidden rounded-[28px] p-6 transition-transform duration-300 active:scale-[0.98] sm:p-8"
              >
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.pexels.com/photos/7679476/pexels-photo-7679476.jpeg?auto=compress&cs=tinysrgb&w=1080"
                    alt="Vendeur photographiant une robe en boutique pour un live à distance"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent" />
                  <span className="glass absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold">
                    <Globe2 className="text-neon size-3.5" strokeWidth={2.6} />
                    À distance
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold sm:text-2xl">
                  Hub OCD · Toute l&rsquo;Afrique
                </h3>
                <p className="text-mist mt-2 text-sm leading-relaxed">
                  Depuis ta boutique à Douala, Cotonou ou N&rsquo;Djamena : tu
                  soumets ton lien, notre équipe le valide en direct, et tu vends.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {["Validation du lien par l'équipe Bovant", "Support WhatsApp pendant le live", "Abonnement à 5 000 XOF/mois"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Check className="text-neon size-4" strokeWidth={3} /> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    Dès <span className="font-display text-base font-bold text-white">2 500 XOF</span>
                  </span>
                  <span className="btn btn-neon !min-h-[44px] !rounded-xl px-4 text-[13px]">
                    Rejoindre le Hub
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.6} />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ——— Process ——— */}
        <section id="process" className="border-y border-white/5 bg-ink/50">
          <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
            <Reveal>
              <p className="eyebrow text-mag">Simple comme un message</p>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                En live en 3 étapes
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {PROCESS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.1}>
                  <div className="glass edge-top relative h-full rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                      <p.icon className="text-neon size-6" strokeWidth={2.2} />
                      <span className="font-display text-grad text-2xl font-extrabold">{p.n}</span>
                    </div>
                    <h3 className="font-display mt-5 text-lg font-bold">{p.title}</h3>
                    <p className="text-mist mt-2 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Programme du jour ——— */}
        <section id="programme" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow text-neon">Programme du jour</p>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Deux fenêtres quotidiennes pour <span className="text-grad-live">cartonner</span>
              </h2>
              <p className="text-mist mt-4 max-w-md text-sm leading-relaxed sm:text-base">
                Les moments où les acheteurs sont connectés : le matin avant le
                marché, et le soir après le travail. Chaque session dure 1h30.
              </p>
              <div className="mt-8 space-y-4">
                {WINDOWS.map((w) => (
                  <div key={w.id} className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
                    <div className="flex items-center gap-3">
                      <span className="glass grid size-11 place-items-center rounded-2xl">
                        <Clock3 className="text-live size-5" strokeWidth={2.4} />
                      </span>
                      <div>
                        <p className="font-display font-bold">{w.label}</p>
                        <p className="text-xs text-white/45">{w.range} · GMT</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(w.id === "matin" ? SLOT_TIMES.slice(0, 2) : SLOT_TIMES.slice(2)).map(([s]) => (
                        <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                          {s.replace(":", "h")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10">
                  <Image
                    src="https://images.pexels.com/photos/34368004/pexels-photo-34368004.jpeg?auto=compress&cs=tinysrgb&w=1080"
                    alt="Néon ON AIR rouge — studio de diffusion OCD Live"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/10 to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                    <span className="live-dot" /> On air
                  </span>
                  <div className="absolute right-5 bottom-5 left-5">
                    <p className="font-display text-lg font-bold">Studio OCD · Boulevard du 13 Janvier</p>
                    <p className="text-sm text-white/60">Lomé, Togo — lumière cinéma, son pro, décor brandsafe</p>
                  </div>
                </div>
                <div className="glass-deep floaty absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3.5">
                  <Video className="text-neon size-5" />
                  <p className="text-sm font-semibold whitespace-nowrap">
                    56 créneaux ouverts sur 14 jours
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ——— Offres ——— */}
        <section id="offres" className="border-y border-white/5 bg-ink/50">
          <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
            <Reveal className="text-center">
              <p className="eyebrow text-mag justify-center">Offres &amp; tarifs</p>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Des prix <span className="text-grad">pensés pour toi</span>
              </h2>
              <p className="text-mist mx-auto mt-4 max-w-xl text-sm sm:text-base">
                Paiement Mobile Money ou espèces au studio. Ton reçu part
                immédiatement sur ton WhatsApp.
              </p>
            </Reveal>

            {fmtOffersGroups().map((group) => (
              <div key={group.mode} className="mt-14">
                <Reveal>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="live-dot" />
                    <h3 className="font-display text-sm font-bold tracking-[0.2em] text-white/70 uppercase">
                      {group.title}
                    </h3>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                  </div>
                </Reveal>
                <div className="grid gap-4 sm:grid-cols-3">
                  {group.offers.map((o, i) => (
                    <Reveal key={o.id} delay={i * 0.08}>
                      <div
                        className={`relative flex h-full flex-col rounded-3xl p-6 ${
                          o.popular ? "glass-deep edge-top ring-1 ring-neon/40" : "glass"
                        }`}
                      >
                        {o.popular && (
                          <span className="from-live to-mag absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-[10px] font-extrabold tracking-[0.14em] uppercase shadow-lg">
                            <Sparkles className="size-3" strokeWidth={2.6} />
                            Le plus choisi
                          </span>
                        )}
                        <h4 className="font-display text-base font-bold">{o.name}</h4>
                        <p className="mt-1 text-xs text-white/45">{o.tagline}</p>
                        <p className="font-display mt-4 text-3xl font-extrabold tracking-tight">
                          {o.priceFmt}
                          {o.period && <span className="text-sm font-semibold text-white/50"> {o.period}</span>}
                        </p>
                        <ul className="text-mist mt-5 flex-1 space-y-2.5 text-[13px]">
                          {o.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className={`mt-0.5 size-4 shrink-0 ${group.mode === "presentiel" ? "text-live" : "text-neon"}`} strokeWidth={3} />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/reserver?mode=${group.mode}&offer=${o.id}`}
                          className={`btn mt-6 w-full !min-h-[48px] text-[13px] ${o.popular ? "btn-primary" : "btn-ghost"}`}
                        >
                          Choisir cette offre
                        </Link>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ——— Témoignage ——— */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 sm:aspect-square lg:aspect-[4/5]">
                <Image
                  src="https://images.pexels.com/photos/19178617/pexels-photo-19178617.jpeg?auto=compress&cs=tinysrgb&w=1080"
                  alt="Commerçante dans sa boutique de pagnes colorés"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Quote className="text-neon size-8" strokeWidth={1.6} />
              <blockquote className="font-display mt-5 text-2xl leading-snug font-bold tracking-tight text-balance sm:text-4xl">
                «&nbsp;J&rsquo;ai écoulé tout mon stock de pagnes en{" "}
                <span className="text-grad-live">un seul live</span> de 1h30.&nbsp;»
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <span className="from-neon to-mag font-display grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-sm font-extrabold text-abyss">
                  AK
                </span>
                <div>
                  <p className="font-semibold">Afi K.</p>
                  <p className="text-sm text-white/45">Boutique de pagnes · Lomé</p>
                </div>
                <span className="glass ml-auto hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white/80 sm:inline-flex">
                  <TrendingIcon /> +180 ventes / live
                </span>
              </div>
              <Link href="/reserver" className="btn btn-primary mt-8">
                Je veux le même résultat
                <ArrowRight className="size-4" strokeWidth={2.6} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ——— CTA final ——— */}
        <section className="px-4 pb-24 sm:px-6">
          <Reveal>
            <div className="glass-deep edge-top relative mx-auto max-w-4xl overflow-hidden rounded-[32px] px-6 py-14 text-center sm:py-16">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,242,254,0.08),transparent),radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(255,0,80,0.1),transparent)]"
              />
              <div className="relative">
                <Logo size="lg" />
                <h2 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
                  Prête à allumer <span className="text-grad-live">ton live&nbsp;?</span>
                </h2>
                <p className="text-mist mx-auto mt-4 max-w-md text-sm sm:text-base">
                  Réservation en 2 minutes, sans création de compte. Ton reçu
                  arrive immédiatement.
                </p>
                <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link href="/reserver?mode=presentiel" className="btn btn-primary">
                    <MapPin className="size-4" strokeWidth={2.6} /> Studio Lomé
                  </Link>
                  <Link href="/reserver?mode=distance" className="btn btn-ghost">
                    <Globe2 className="text-neon size-4" strokeWidth={2.6} /> Hub à distance
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function TrendingIcon() {
  return <ArrowUpRight className="text-neon size-3.5" strokeWidth={2.6} />;
}
