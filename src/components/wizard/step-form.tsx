"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe2, MapPin, Pencil, Ticket, UserRound, MessageCircle, Store } from "lucide-react";
import type { Mode } from "@/lib/catalog";
import type { FieldErrors } from "./types";

interface Props {
  mode: Mode;
  name: string;
  whatsapp: string;
  business: string;
  errors: FieldErrors;
  onChange: (field: "name" | "whatsapp" | "business", value: string) => void;
  onBlurField: (field: "name" | "whatsapp" | "business") => void;
  summary: {
    modeLabel: string;
    detail: string | null;
    offerName: string | null;
    price: string | null;
  };
  onEdit: (step: number) => void;
}

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-live overflow-hidden pt-1.5 pl-1 text-xs font-medium"
          role="alert"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Étape 4 — Capture de données allégée + récap éditable. */
export function StepForm({
  mode,
  name,
  whatsapp,
  business,
  errors,
  onChange,
  onBlurField,
  summary,
  onEdit,
}: Props) {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-tight font-extrabold tracking-tight text-balance sm:text-3xl">
          Dernière ligne droite
        </h1>
        <p className="text-mist mt-2 text-sm leading-relaxed">
          Trois champs, et ton reçu OCD Live part immédiatement.
        </p>
      </header>

      {/* Récap du funnel — modifiable */}
      <div className="glass-deep edge-top mb-6 rounded-3xl p-4">
        {[
          {
            icon: mode === "presentiel" ? MapPin : Globe2,
            label: "Mode",
            value: summary.modeLabel,
            step: 1,
          },
          {
            icon: Ticket,
            label: mode === "presentiel" ? "Créneau" : "Profil",
            value: summary.detail ?? "—",
            step: 1,
          },
          {
            icon: Store,
            label: "Offre",
            value: summary.offerName
              ? `${summary.offerName} · ${summary.price}`
              : "—",
            step: 2,
          },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="glass grid size-9 shrink-0 place-items-center rounded-xl">
              <r.icon className="text-neon size-4" strokeWidth={2.4} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase">{r.label}</p>
              <p className="truncate text-sm font-semibold">{r.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="text-mist hover:text-neon flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-bold transition"
            >
              <Pencil className="size-3.5" />
              Modifier
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        <div>
          <label htmlFor="w-name" className="mb-1.5 flex items-center gap-1.5 pl-1 text-[13px] font-semibold text-white/80">
            <UserRound className="size-3.5 text-white/40" /> Ton nom complet
          </label>
          <input
            id="w-name"
            type="text"
            autoComplete="name"
            placeholder="Ex : Afi Kossi"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            onBlur={() => onBlurField("name")}
            className={`field ${errors.name ? "field-error" : ""}`}
          />
          <FieldError msg={errors.name} />
        </div>

        <div>
          <label htmlFor="w-wa" className="mb-1.5 flex items-center gap-1.5 pl-1 text-[13px] font-semibold text-white/80">
            <MessageCircle className="size-3.5 text-white/40" /> Numéro WhatsApp
          </label>
          <input
            id="w-wa"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Ex : +228 90 12 34 56"
            value={whatsapp}
            onChange={(e) => onChange("whatsapp", e.target.value)}
            onBlur={() => onBlurField("whatsapp")}
            className={`field ${errors.whatsapp ? "field-error" : ""}`}
          />
          <FieldError msg={errors.whatsapp} />
          {!errors.whatsapp && (
            <p className="pt-1.5 pl-1 text-xs text-white/35">
              C&rsquo;est ici que tu reçois ta confirmation.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="w-biz" className="mb-1.5 flex items-center justify-between pl-1 text-[13px] font-semibold text-white/80">
            <span className="flex items-center gap-1.5">
              <Store className="size-3.5 text-white/40" /> Que vends-tu ?
            </span>
            <span className={`text-[11px] font-medium tabular-nums ${business.length > 160 ? "text-live" : "text-white/35"}`}>
              {business.length}/160
            </span>
          </label>
          <textarea
            id="w-biz"
            rows={3}
            placeholder="Ex : Je vends des pagnes wax et des robes sur mesure au marché de Lomé."
            value={business}
            onChange={(e) => onChange("business", e.target.value)}
            onBlur={() => onBlurField("business")}
            className={`field resize-none !leading-relaxed !min-h-[96px] py-3.5 ${errors.business ? "field-error" : ""}`}
          />
          <FieldError msg={errors.business} />
        </div>
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-white/30">
        En confirmant, tu acceptes d&rsquo;être contactée par OCD Live ({""}
        House of Challenge) pour l&rsquo;organisation de ta session.
      </p>
    </div>
  );
}
