"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  Copy,
  ExternalLink,
  Home,
  Link2,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/catalog";
import { fmtXOF } from "@/lib/format";
import { liveUrlSchema } from "@/lib/validation";
import type { BookingResult } from "./types";

const STATUS_LABEL: Record<BookingResult["liveStatus"], string> = {
  none: "",
  submitted: "Lien en cours de validation",
  validated: "Lien validé par Bovant",
  rejected: "Lien refusé — contacte-nous",
};

/** Reçu professionnel généré après réservation (carte de partage brandée). */
export function Receipt({ booking }: { booking: BookingResult }) {
  const [copied, setCopied] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [liveState, setLiveState] = useState<BookingResult["liveStatus"]>(booking.liveStatus);
  const [liveErr, setLiveErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const isDistance = booking.mode === "distance";

  const waText = encodeURIComponent(
    `Bonjour OCD Live ! Je confirme ma réservation ${booking.reference} — ${booking.offerName} (${fmtXOF(booking.priceXof)})${booking.slotLabel ? ` · ${booking.slotLabel}` : ""}.`
  );

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(booking.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponible : silencieux */
    }
  }

  async function submitLive() {
    const check = liveUrlSchema.safeParse({ url: liveUrl.trim() });
    if (!check.success) {
      setLiveErr(check.error.issues[0]?.message ?? "Lien invalide");
      return;
    }
    setLiveErr(null);
    setSending(true);
    try {
      const res = await fetch(`/api/bookings/${booking.reference}/live`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: check.data.url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLiveErr(data.error ?? "Erreur — réessaye");
        return;
      }
      setLiveState("submitted");
    } catch {
      setLiveErr("Réseau instable — réessaye");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {/* ——— Animation de succès ——— */}
      <div className="mb-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 210, damping: 15 }}
          className="from-neon to-live relative grid size-20 place-items-center rounded-full bg-gradient-to-br shadow-[0_20px_50px_-14px_rgba(255,0,80,0.6)]"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-neon/20 [animation-iteration-count:3]" />
          <Check className="size-9 text-abyss" strokeWidth={3.2} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          Réservation reçue&nbsp;!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="text-mist mt-2 max-w-xs text-sm leading-relaxed"
        >
          {booking.name.split(" ")[0]}, ton reçu est prêt. L&rsquo;équipe OCD
          confirme sur WhatsApp en moins de 15 min.
        </motion.p>
      </div>

      {/* ——— Le reçu ——— */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-deep edge-top overflow-hidden rounded-[28px]"
      >
        <div className="border-b border-dashed border-white/12 px-6 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-[10px] font-extrabold tracking-[0.14em] text-amber-300 uppercase ring-1 ring-amber-300/25 ring-inset">
              En attente
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase">
            Référence de réservation
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="font-display text-grad-live text-2xl font-extrabold tracking-wide sm:text-3xl">
              {booking.reference}
            </p>
            <button
              type="button"
              onClick={copyRef}
              className="btn btn-ghost !min-h-[40px] !rounded-xl px-3 text-xs"
            >
              {copied ? (
                <>
                  <Check className="text-neon size-4" strokeWidth={3} /> Copié
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copier
                </>
              )}
            </button>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            {[
              ["Offre", booking.offerName],
              ["Montant", fmtXOF(booking.priceXof)],
              ...(booking.slotLabel
                ? [[isDistance ? "Profil live" : "Créneau", booking.slotLabel]]
                : []),
              ["Réservé par", booking.name],
              ["WhatsApp", booking.whatsapp],
            ].map(([k, v]) => (
              <div key={k as string} className="flex items-baseline justify-between gap-4">
                <dt className="shrink-0 text-white/40">{k}</dt>
                <dd className="text-right font-semibold break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-dashed border-white/12 px-6 py-5">
          <div className="barcode h-10 w-full opacity-70" aria-hidden />
          <p className="mt-3 flex items-center justify-between text-[10px] tracking-[0.18em] text-white/35 uppercase">
            <span>Reçu officiel OCD Live</span>
            <span>{BRAND.company}</span>
          </p>
        </div>
      </motion.div>

      {/* ——— Lien de live (distance) ——— */}
      {isDistance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass mt-5 rounded-3xl p-5"
        >
          <h2 className="font-display flex items-center gap-2 text-sm font-bold">
            <Link2 className="text-neon size-4" strokeWidth={2.4} />
            Soumets ton lien de live
          </h2>
          <p className="text-mist mt-1.5 text-xs leading-relaxed">
            Le jour J, pendant ta fenêtre (08h–11h ou 18h–21h), colle ici ton
            lien TikTok / Facebook Live. Validation express par l&rsquo;équipe{" "}
            {BRAND.founder}.
          </p>

          {liveState === "none" || liveState === "rejected" ? (
            <>
              <div className="mt-3.5 flex gap-2">
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://www.tiktok.com/@toi/live"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className={`field !min-h-[48px] flex-1 text-sm ${liveErr ? "field-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={submitLive}
                  disabled={sending || !liveUrl.trim()}
                  className="btn btn-neon !min-h-[48px] shrink-0 px-4 text-sm"
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" strokeWidth={2.4} />}
                  Envoyer
                </button>
              </div>
              {liveErr && <p className="text-live pt-2 pl-1 text-xs font-medium">{liveErr}</p>}
            </>
          ) : (
            <p
              className={`mt-3.5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${
                liveState === "validated"
                  ? "bg-neon/10 text-neon ring-neon/25 ring-1 ring-inset"
                  : "bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/25 ring-inset"
              }`}
            >
              <BadgeCheck className="size-4 shrink-0" strokeWidth={2.6} />
              {STATUS_LABEL[liveState]}
            </p>
          )}
        </motion.div>
      )}

      {/* ——— Actions ——— */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="mt-6 space-y-3"
      >
        <a
          href={`https://wa.me/${BRAND.whatsappNumber}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary w-full text-[15px]"
        >
          <MessageCircle className="size-5" strokeWidth={2.4} />
          Confirmer sur WhatsApp
        </a>
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/recu/${booking.reference}`} className="btn btn-ghost text-sm">
            <ExternalLink className="text-neon size-4" />
            Carte de partage
          </Link>
          <Link href="/" className="btn btn-ghost text-sm">
            <Home className="size-4" />
            Accueil
          </Link>
        </div>
        <p className="pt-1 text-center text-[11px] leading-relaxed text-white/30">
          {isDistance
            ? "Ta référence est demandée pour toute modification."
            : `Présente ta référence à l'accueil du studio (${BRAND.studioCity}).`}
        </p>
      </motion.div>

      <AnimatePresence>
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-neon fixed bottom-28 left-1/2 -translate-x-1/2 text-xs font-bold"
          >
            Référence copiée
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
