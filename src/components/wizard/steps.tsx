"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Clock3,
  Globe2,
  MapPin,
  RefreshCw,
  Shirt,
  Smartphone,
  Palette,
  UtensilsCrossed,
  HandHeart,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, COUNTRIES, WINDOWS, type Mode } from "@/lib/catalog";
import { slotRange } from "@/lib/format";
import type { DayVm, SlotVm } from "./types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  mode: Shirt,
  food: UtensilsCrossed,
  services: HandHeart,
  tech: Smartphone,
  artisanat: Palette,
};

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-[26px] leading-tight font-extrabold tracking-tight text-balance sm:text-3xl">
        {title}
      </h1>
      <p className="text-mist mt-2 text-sm leading-relaxed">{sub}</p>
    </header>
  );
}

/** Cercle radio custom — visible même sur fond photo */
function Radio({ on }: { on: boolean }) {
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
        on
          ? "border-live bg-live/20 shadow-[0_0_0_4px_rgba(255,0,80,0.15)]"
          : "border-white/25 bg-black/30"
      }`}
    >
      <motion.span
        initial={false}
        animate={{ scale: on ? 1 : 0 }}
        className="size-3 rounded-full bg-white"
      />
    </span>
  );
}

/* ————————————————— ÉTAPE 1 · MODE ————————————————— */

export function StepMode({
  selected,
  onSelect,
}: {
  selected: Mode | null;
  onSelect: (m: Mode) => void;
}) {
  const cards: Array<{
    mode: Mode;
    img: string;
    alt: string;
    badge: string;
    badgeIcon: LucideIcon;
    title: string;
    sub: string;
    price: string;
  }> = [
    {
      mode: "presentiel",
      img: "https://images.pexels.com/photos/7676406/pexels-photo-7676406.jpeg?auto=compress&cs=tinysrgb&w=640",
      alt: "Studio OCD avec ring light et néons",
      badge: "Présentiel",
      badgeIcon: MapPin,
      title: "Studio OCD · Lomé",
      sub: "Lumière pro, régie et décor inclus — tu viens avec tes produits.",
      price: "dès 15 000 XOF",
    },
    {
      mode: "distance",
      img: "https://images.pexels.com/photos/7679476/pexels-photo-7679476.jpeg?auto=compress&cs=tinysrgb&w=640",
      alt: "Produits photographiés en boutique pour un live à distance",
      badge: "À distance",
      badgeIcon: Globe2,
      title: "Hub · depuis ta boutique",
      sub: "Tu soumets ton lien de live, on le valide en direct. 12 pays.",
      price: "dès 2 500 XOF",
    },
  ];

  return (
    <div>
      <StepHead
        title="Choisis ton mode de live"
        sub="Deux options, une même promesse : vendre en direct, sans friction."
      />
      <div className="space-y-3.5">
        {cards.map((c) => {
          const on = selected === c.mode;
          return (
            <button
              key={c.mode}
              type="button"
              onClick={() => onSelect(c.mode)}
              aria-pressed={on}
              className={`group flex w-full items-center gap-4 rounded-3xl p-3.5 text-left transition-all duration-200 active:scale-[0.98] ${
                on ? "glass-deep edge-top ring-live/40 ring-1" : "glass hover:bg-white/[0.06]"
              }`}
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
                <Image
                  src={c.img}
                  alt={c.alt}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/60 to-transparent" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-mist inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.18em] uppercase">
                  <c.badgeIcon className={c.mode === "presentiel" ? "text-live size-3" : "text-neon size-3"} strokeWidth={2.8} />
                  {c.badge}
                </span>
                <p className="font-display mt-0.5 truncate text-base font-bold sm:text-lg">
                  {c.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/50">{c.sub}</p>
                <p className="text-neon mt-1.5 text-xs font-bold">{c.price}</p>
              </div>
              <Radio on={on} />
            </button>
          );
        })}
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-white/35">
        <Clock3 className="size-3.5" />
        Sessions d&rsquo;1h30 · tous les jours 08h–11h &amp; 18h–21h (GMT)
      </p>
    </div>
  );
}

/* ————————————————— ÉTAPE 2A · CRÉNEAUX STUDIO ————————————————— */

export function StepSlots({
  days,
  error,
  onRetry,
  selectedDay,
  onPickDay,
  selectedSlot,
  onPickSlot,
}: {
  days: DayVm[] | null;
  error: boolean;
  onRetry: () => void;
  selectedDay: string | null;
  onPickDay: (d: string) => void;
  selectedSlot: SlotVm | null;
  onPickSlot: (s: SlotVm) => void;
}) {
  const current = days?.find((d) => d.date === selectedDay) ?? days?.[0];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <StepHead
          title="Choisis ton créneau studio"
          sub="Sessions d'1h30 au studio OCD de Lomé. Le créneau se bloque dès ta confirmation."
        />
        <button
          type="button"
          onClick={onRetry}
          aria-label="Actualiser les disponibilités"
          className="glass grid size-10 shrink-0 place-items-center rounded-xl transition hover:bg-white/10"
        >
          <RefreshCw className="size-4 text-white/70" />
        </button>
      </div>

      {/* Squelette de chargement */}
      {!days && !error && (
        <div className="space-y-5">
          <div className="flex gap-2.5 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass h-[76px] w-[72px] shrink-0 animate-pulse rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass h-[62px] animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-sm text-white/70">Impossible de charger le calendrier.</p>
          <button type="button" onClick={onRetry} className="btn btn-ghost mt-4 !min-h-[46px] px-5 text-sm">
            <RefreshCw className="size-4" /> Réessayer
          </button>
        </div>
      )}

      {days && (
        <>
          {/* Jours — scroll horizontal pouce-friendly */}
          <div className="scrollbar-none -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1">
            {days.map((d) => {
              const on = d.date === (current?.date ?? selectedDay);
              const free = d.slots.filter((s) => s.available).length;
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => onPickDay(d.date)}
                  aria-pressed={on}
                  className={`flex w-[72px] shrink-0 snap-start flex-col items-center rounded-2xl px-2 py-3 transition-all active:scale-95 ${
                    on
                      ? "from-aqua/90 to-neon/90 bg-gradient-to-b text-abyss shadow-[0_10px_28px_-10px_rgba(0,242,254,0.6)]"
                      : "glass"
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-wide uppercase ${on ? "text-abyss/70" : "text-white/45"}`}>
                    {d.isToday ? "Auj." : d.wd.replace(".", "")}
                  </span>
                  <span className="font-display mt-0.5 text-xl font-extrabold">{d.day}</span>
                  <span className={`text-[10px] font-semibold ${on ? "text-abyss/70" : "text-white/45"}`}>
                    {d.mo}
                  </span>
                  <span
                    className={`mt-1.5 size-1.5 rounded-full ${
                      free > 0 ? (on ? "bg-abyss" : "bg-neon") : "bg-live"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Heures */}
          {current && (
            <motion.div
              key={current.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5"
            >
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/50">
                <Clock3 className="size-3.5" />
                {current.isToday
                  ? "Aujourd'hui"
                  : `${current.wd.replace(".", "")} ${current.day} ${current.mo}`}{" "}
                · heure de Lomé (GMT)
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {current.slots.map((s) => {
                  const on = selectedSlot?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!s.available}
                      onClick={() => onPickSlot(s)}
                      aria-pressed={on}
                      className={`flex min-h-[62px] flex-col items-center justify-center rounded-2xl text-center transition-all active:scale-95 ${
                        on
                          ? "from-live to-mag bg-gradient-to-r font-bold shadow-[0_12px_32px_-10px_rgba(255,0,80,0.65)]"
                          : s.available
                            ? "glass hover:bg-white/[0.07]"
                            : "border border-white/5 bg-white/[0.02] opacity-40"
                      }`}
                    >
                      <span className={`font-display text-[15px] font-bold ${!s.available && "line-through"}`}>
                        {slotRange(s.start, s.end)}
                      </span>
                      <span className={`mt-0.5 text-[10px] font-semibold tracking-wide uppercase ${on ? "text-white/80" : s.available ? "text-neon" : "text-mist"}`}>
                        {s.available ? "Libre" : "Complet"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="text-mist mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                {WINDOWS.map((w) => (
                  <span key={w.id} className="inline-flex items-center gap-1.5">
                    <span className="live-dot" style={{ width: 5, height: 5 }} />
                    Fenêtre {w.label.toLowerCase()} {w.range}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

/* ————————————————— ÉTAPE 2B · HUB À DISTANCE ————————————————— */

export function StepRemote({
  country,
  category,
  onCountry,
  onCategory,
}: {
  country: string | null;
  category: string | null;
  onCountry: (c: string) => void;
  onCategory: (c: string) => void;
}) {
  return (
    <div>
      <StepHead
        title="Ta boutique rejoint le Hub"
        sub="Dis-nous où tu diffuses et ce que tu vends — ton lien de live sera validé par l'équipe Bovant."
      />

      <p className="eyebrow text-neon mb-3">Ton pays</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {COUNTRIES.map((c) => {
          const on = country === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onCountry(c.code)}
              aria-pressed={on}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 transition-all active:scale-95 ${
                on
                  ? "glass-deep ring-neon/60 ring-1"
                  : "glass hover:bg-white/[0.06]"
              }`}
            >
              <span
                className={`font-display grid size-8 place-items-center rounded-lg text-[11px] font-extrabold tracking-wider ${
                  on
                    ? "from-aqua to-neon text-abyss bg-gradient-to-br"
                    : "bg-white/8 text-white/80"
                }`}
              >
                {c.code}
              </span>
              <span className={`text-[11px] leading-tight font-medium ${on ? "text-white" : "text-white/55"}`}>
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="eyebrow text-mag mt-8 mb-3">Ta catégorie</p>
      <div className="space-y-2.5">
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICONS[c.id] ?? Shirt;
          const on = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onCategory(c.id)}
              aria-pressed={on}
              className={`flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all active:scale-[0.98] ${
                on ? "glass-deep ring-mag/50 ring-1" : "glass hover:bg-white/[0.06]"
              }`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl transition-colors ${
                  on ? "from-live to-mag bg-gradient-to-br" : "bg-white/6"
                }`}
              >
                <Icon className="size-5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-sm font-bold">{c.label}</span>
                <span className="mt-0.5 block truncate text-xs text-white/45">{c.hint}</span>
              </span>
              {on ? (
                <Check className="text-mag size-5 shrink-0" strokeWidth={3} />
              ) : (
                <ChevronRight className="size-4 shrink-0 text-white/25" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-white/35">
        Pendant ta session ({WINDOWS.map((w) => `${w.range}`).join(" ou ")}), tu
        colles ton lien TikTok / Facebook Live dans ton reçu — validation en
        moins de 2 minutes.
      </p>
    </div>
  );
}
