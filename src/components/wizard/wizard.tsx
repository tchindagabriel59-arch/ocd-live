"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  CircleAlert,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { COUNTRIES, CATEGORIES, getOffer, BRAND, type Mode } from "@/lib/catalog";
import { contactSchema } from "@/lib/validation";
import { fmtXOF, slotRange } from "@/lib/format";
import { StepMode, StepSlots, StepRemote } from "./steps";
import { StepOffer } from "./step-offer";
import { StepForm } from "./step-form";
import { Receipt } from "./receipt";
import type { BookingResult, DayVm, FieldErrors, SlotVm } from "./types";

const LABELS = ["Mode", "Programme", "Offre", "Contact", "Reçu"];

const stepVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 56 : -56, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir >= 0 ? -56 : 56, opacity: 0, filter: "blur(4px)" }),
};

export function Wizard({
  initialMode,
  initialOffer,
}: {
  initialMode: Mode | null;
  initialOffer: string | null;
}) {
  // ——— État du funnel ———
  const [mode, setMode] = useState<Mode | null>(initialMode);
  const [step, setStep] = useState(initialMode ? 1 : 0);
  const [dir, setDir] = useState(1);

  const [days, setDays] = useState<DayVm[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<SlotVm | null>(null);

  const [country, setCountry] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const offerValid = initialOffer && getOffer(initialOffer)?.mode === (initialMode ?? getOffer(initialOffer)?.mode);
  const [offerId, setOfferId] = useState<string | null>(offerValid ? initialOffer : null);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [business, setBusiness] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const offer = offerId ? getOffer(offerId) : undefined;

  // ——— Chargement du calendrier (présentiel uniquement) ———
  const loadSlots = useCallback(async () => {
    setSlotsError(false);
    try {
      const res = await fetch("/api/slots", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { days: DayVm[] };
      setDays(data.days);
      setDay((d) => d ?? data.days[0]?.date ?? null);
    } catch {
      setSlotsError(true);
    }
  }, []);

  useEffect(() => {
    if (mode === "presentiel" && !days && !slotsError) void loadSlots();
  }, [mode, days, slotsError, loadSlots]);

  // Remonter en haut à chaque étape (mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Toast auto-effacé
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function pickMode(m: Mode) {
    setMode(m);
    // auto-avance douce : le funnel file sans friction
    if (step === 0) setTimeout(() => go(1), 240);
    // ré-init des choix incompatibles
    setSlot(null);
    setCountry(null);
    setCategory(null);
    setOfferId((o) => (o && getOffer(o)?.mode === m ? o : null));
  }

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return !!mode;
      case 1:
        return mode === "presentiel" ? !!slot : !!(country && category);
      case 2:
        return !!offer;
      case 3: {
        const r = contactSchema.safeParse({ name, whatsapp, business });
        return r.success;
      }
      default:
        return false;
    }
  }, [step, mode, slot, country, category, offer, name, whatsapp, business]);

  /** Validation instantanée champ par champ (onBlur / saisie) */
  function validateField(field: "name" | "whatsapp" | "business") {
    const full = { name, whatsapp, business };
    const r = contactSchema.safeParse(full);
    setErrors((prev) => {
      const next = { ...prev };
      const issue = !r.success
        ? r.error.issues.find((i) => i.path[0] === field)
        : undefined;
      if (issue) next[field] = issue.message;
      else delete next[field];
      return next;
    });
  }

  async function submit() {
    if (submitting) return;
    const contact = contactSchema.safeParse({ name, whatsapp, business });
    if (!contact.success) {
      const fe: FieldErrors = {};
      for (const i of contact.error.issues) {
        const k = i.path[0] as keyof FieldErrors;
        if (!fe[k]) fe[k] = i.message;
      }
      setErrors(fe);
      setToast("Vérifie les champs surlignés");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          slotId: slot?.id,
          country,
          category,
          offerId,
          ...contact.data,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code?.startsWith("SLOT")) {
          // Le créneau vient d'être pris : retour calendrier + données fraîches
          setToast(data.error);
          setSlot(null);
          setDays(null);
          await loadSlots();
          go(1);
          return;
        }
        if (data.fields) setErrors(data.fields);
        setToast(data.error ?? "Une erreur est survenue");
        return;
      }
      setResult(data.booking as BookingResult);
      go(4);
    } catch {
      setToast("Réseau instable — réessaye");
    } finally {
      setSubmitting(false);
    }
  }

  const detailLabel =
    mode === "presentiel"
      ? slot
        ? `${days?.find((d) => d.date === day)?.wd ?? ""} ${days?.find((d) => d.date === day)?.day ?? ""} ${days?.find((d) => d.date === day)?.mo ?? ""} · ${slotRange(slot.start, slot.end)}`
        : null
      : country && category
        ? `${COUNTRIES.find((c) => c.code === country)?.name} · ${CATEGORIES.find((c) => c.id === category)?.label}`
        : null;

  return (
    <div className="relative min-h-svh">
      {/* Aurora discrète */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,242,254,0.1),transparent)] blur-2xl" />
        <div className="absolute right-[-20%] bottom-[10%] h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(255,0,80,0.1),transparent)] blur-3xl" />
      </div>

      {/* Barre supérieure du tunnel */}
      <div className="sticky top-0 z-40 glass-deep border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
          <Link href="/" aria-label="Retour à l'accueil OCD Live">
            <Logo size="sm" />
          </Link>
          {step < 4 ? (
            <div className="flex items-center gap-2.5">
              <ol className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} aria-hidden>
                    <motion.span
                      className="block size-1.5 rounded-full"
                      animate={{
                        backgroundColor:
                          i < step
                            ? "#22d3ee"
                            : i === step
                              ? "#ff0050"
                              : "rgba(255,255,255,0.15)",
                        scale: i === step ? 1.35 : 1,
                      }}
                    />
                  </li>
                ))}
              </ol>
              <span className="text-[11px] font-semibold tracking-[0.16em] text-white/50 uppercase">
                {step + 1}/4 · {LABELS[Math.min(step, 3)]}
              </span>
            </div>
          ) : (
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold">
              <span className="live-dot" /> Reçu généré
            </span>
          )}
        </div>
        {/* filet de progression */}
        <div className="h-px w-full bg-white/5">
          <motion.div
            className="from-aqua via-neon to-live h-px bg-gradient-to-r"
            animate={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>

      {/* Corps du wizard */}
      <main className="relative mx-auto max-w-xl px-4 pt-6 pb-44">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && <StepMode selected={mode} onSelect={pickMode} />}

            {step === 1 && mode === "presentiel" && (
              <StepSlots
                days={days}
                error={slotsError}
                onRetry={() => {
                  setDays(null);
                  void loadSlots();
                }}
                selectedDay={day}
                onPickDay={(d) => {
                  setDay(d);
                  setSlot(null);
                }}
                selectedSlot={slot}
                onPickSlot={setSlot}
              />
            )}

            {step === 1 && mode === "distance" && (
              <StepRemote
                country={country}
                category={category}
                onCountry={setCountry}
                onCategory={setCategory}
              />
            )}

            {step === 2 && mode && (
              <StepOffer mode={mode} selected={offerId} onSelect={setOfferId} />
            )}

            {step === 3 && mode && (
              <StepForm
                mode={mode}
                name={name}
                whatsapp={whatsapp}
                business={business}
                errors={errors}
                onChange={(f, v) => {
                  if (f === "name") setName(v);
                  if (f === "whatsapp") setWhatsapp(v);
                  if (f === "business") setBusiness(v);
                }}
                onBlurField={validateField}
                summary={{
                  modeLabel: mode === "presentiel" ? "Studio Lomé" : "Hub à distance",
                  detail: detailLabel,
                  offerName: offer?.name ?? null,
                  price: offer ? fmtXOF(offer.priceXof) + (offer.period ?? "") : null,
                }}
                onEdit={go}
              />
            )}

            {step === 4 && result && <Receipt booking={result} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Barre d'action sticky — zone du pouce */}
      {step < 4 && (
        <div className="glass-deep fixed inset-x-0 bottom-0 z-40 border-t border-white/8">
          <div className="pb-safe mx-auto flex max-w-xl items-center gap-3 px-4 pt-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => go(step - 1)}
                className="btn btn-ghost !min-h-[52px] shrink-0 px-4"
                aria-label="Étape précédente"
              >
                <ChevronLeft className="size-5" strokeWidth={2.4} />
              </button>
            ) : (
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent("Bonjour OCD Live, j'ai une question avant de réserver mon live.")}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost !min-h-[52px] shrink-0 px-4"
                aria-label="Question sur WhatsApp"
              >
                <MessageCircle className="text-neon size-5" strokeWidth={2.2} />
              </a>
            )}
            <button
              type="button"
              disabled={!stepValid || submitting}
              onClick={() => (step === 3 ? void submit() : go(step + 1))}
              className="btn btn-primary flex-1 text-[15px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" strokeWidth={2.6} />
                  Réservation en cours…
                </>
              ) : step === 3 ? (
                <>
                  Confirmer{offer ? ` · ${fmtXOF(offer.priceXof)}` : ""}
                  <ArrowRight className="size-5" strokeWidth={2.6} />
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="size-5" strokeWidth={2.6} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed inset-x-4 bottom-28 z-50 mx-auto max-w-sm"
          >
            <div className="glass-deep flex items-center gap-3 rounded-2xl border-live/30 px-4 py-3.5 text-sm font-medium">
              <CircleAlert className="text-live size-5 shrink-0" strokeWidth={2.4} />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
