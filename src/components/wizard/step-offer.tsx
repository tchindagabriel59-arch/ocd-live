"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { offersFor, type Mode } from "@/lib/catalog";
import { fmtXOF } from "@/lib/format";

/** Étape 3 — Choix de l'offre (filtrée par mode). */
export function StepOffer({
  mode,
  selected,
  onSelect,
}: {
  mode: Mode;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const offers = offersFor(mode);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-tight font-extrabold tracking-tight text-balance sm:text-3xl">
          {mode === "presentiel" ? "Ton pack studio" : "Ton accès au Hub"}
        </h1>
        <p className="text-mist mt-2 text-sm leading-relaxed">
          Paiement Mobile Money ou espèces au studio. Aucune création de compte.
        </p>
      </header>

      <div className="space-y-3.5">
        <AnimatePresence initial={false}>
          {offers.map((o) => {
            const on = selected === o.id;
            return (
              <motion.button
                key={o.id}
                layout
                type="button"
                onClick={() => onSelect(o.id)}
                aria-pressed={on}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full rounded-3xl p-5 text-left transition-colors ${
                  on
                    ? "glass-deep edge-top ring-live/45 ring-1"
                    : "glass hover:bg-white/[0.06]"
                }`}
              >
                {o.popular && (
                  <span className="from-live to-mag absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2.5 py-1 text-[9px] font-extrabold tracking-[0.16em] uppercase shadow-lg">
                    <Sparkles className="size-2.5" strokeWidth={2.8} />
                    Le plus choisi
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold sm:text-lg">{o.name}</p>
                    <p className="mt-0.5 text-xs text-white/45">{o.tagline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-display text-lg font-extrabold whitespace-nowrap sm:text-xl ${on ? "text-grad-live" : ""}`}>
                      {fmtXOF(o.priceXof)}
                    </p>
                    {o.period && (
                      <p className="text-[11px] font-semibold text-white/45">{o.period}</p>
                    )}
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {o.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-white/70">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${mode === "presentiel" ? "text-live" : "text-neon"}`}
                        strokeWidth={3}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div
                  className={`mt-4 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                    on
                      ? "from-live to-mag bg-gradient-to-r text-white shadow-[0_10px_28px_-10px_rgba(255,0,80,0.6)]"
                      : "bg-white/6 text-white/70"
                  }`}
                >
                  {on ? (
                    <>
                      <Check className="size-4" strokeWidth={3} />
                      Offre sélectionnée
                    </>
                  ) : (
                    "Choisir cette offre"
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
