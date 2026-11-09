import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowRight, Home } from "lucide-react";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { Logo } from "@/components/logo";
import { BRAND, CATEGORIES, COUNTRIES } from "@/lib/catalog";
import { fmtXOF, maskPhone } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Reçu ${reference.toUpperCase()}`,
    robots: { index: false },
  };
}

const STATUS_UI = {
  pending: { label: "En attente de confirmation", cls: "bg-amber-400/10 text-amber-300 ring-amber-300/25" },
  confirmed: { label: "Confirmée", cls: "bg-neon/10 text-neon ring-neon/30" },
  cancelled: { label: "Annulée", cls: "bg-live/10 text-live ring-live/30" },
} as const;

const LIVE_UI: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Lien de live en validation", cls: "bg-amber-400/10 text-amber-300 ring-amber-300/25" },
  validated: { label: "Lien de live validé", cls: "bg-neon/10 text-neon ring-neon/30" },
  rejected: { label: "Lien de live refusé", cls: "bg-live/10 text-live ring-live/30" },
};

/** Carte de partage publique d'une réservation — brandée OCD Live. */
export default async function ReceiptPage({ params }: Params) {
  const { reference } = await params;
  const [b] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference.toUpperCase()))
    .limit(1);

  if (!b) notFound();

  const status = STATUS_UI[b.status];
  const live = b.liveStatus !== "none" ? LIVE_UI[b.liveStatus] : null;
  const countryName = b.country
    ? COUNTRIES.find((c) => c.code === b.country)?.name ?? b.country
    : null;
  const categoryLabel = b.category
    ? CATEGORIES.find((c) => c.id === b.category)?.label ?? b.category
    : null;

  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(b.createdAt);

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-16">
      {/* Aurora */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,242,254,0.12),transparent)] blur-2xl" />
        <div className="absolute right-[-15%] bottom-[-5%] h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(255,0,80,0.12),transparent)] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-deep edge-top overflow-hidden rounded-[28px]">
          {/* En-tête brandée */}
          <div className="border-b border-dashed border-white/12 px-6 pt-7 pb-6">
            <div className="flex items-center justify-between gap-3">
              <Logo size="md" />
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.12em] uppercase ring-1 ring-inset ${status.cls}`}>
                {status.label}
              </span>
            </div>
            {live && (
              <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.12em] uppercase ring-1 ring-inset ${live.cls}`}>
                {live.label}
              </span>
            )}
          </div>

          {/* Référence */}
          <div className="px-6 py-6">
            <p className="text-[10px] font-bold tracking-[0.22em] text-white/40 uppercase">
              Référence de réservation
            </p>
            <p className="font-display text-grad-live mt-1 text-3xl font-extrabold tracking-wide">
              {b.reference}
            </p>

            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Offre", b.offerName],
                ["Montant", fmtXOF(b.priceXof)],
                [b.mode === "presentiel" ? "Mode" : "Mode", b.mode === "presentiel" ? "Studio Lomé" : "Hub à distance"],
                ...(b.slotLabel ? [[b.mode === "presentiel" ? "Créneau" : "Profil", b.slotLabel]] : []),
                ...(countryName ? [["Pays", countryName]] : []),
                ...(categoryLabel ? [["Catégorie", categoryLabel]] : []),
                ["Réservé par", b.name],
                ["WhatsApp", maskPhone(b.whatsapp)],
                ["Émis le", dateStr + " (GMT)"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4">
                  <dt className="shrink-0 text-white/40">{k}</dt>
                  <dd className="text-right font-semibold break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Code-barres + marque */}
          <div className="border-t border-dashed border-white/12 px-6 py-5">
            <div className="barcode h-10 w-full opacity-70" aria-hidden />
            <p className="mt-3 flex items-center justify-between text-[10px] tracking-[0.18em] text-white/35 uppercase">
              <span>Reçu officiel OCD Live</span>
              <span>{BRAND.company}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/reserver" className="btn btn-primary text-sm">
            Réserver aussi <ArrowRight className="size-4" strokeWidth={2.6} />
          </Link>
          <Link href="/" className="btn btn-ghost text-sm">
            <Home className="size-4" /> Accueil
          </Link>
        </div>
        <p className="mt-4 text-center text-[11px] text-white/30">
          {BRAND.name} · {BRAND.company} — fondé par {BRAND.founder} ·{" "}
          {BRAND.studioCity}
        </p>
      </div>
    </main>
  );
}
