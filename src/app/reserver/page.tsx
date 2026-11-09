import type { Metadata } from "next";
import { Wizard } from "@/components/wizard/wizard";
import { getOffer, type Mode } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Réserver un live",
  description:
    "Wizard de réservation OCD Live : choisis ton mode, ton créneau, ton offre — reçu immédiat. Studio Lomé ou Hub Afrique.",
};

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const rawMode = typeof sp.mode === "string" ? sp.mode : null;
  const mode: Mode | null =
    rawMode === "presentiel" || rawMode === "distance" ? rawMode : null;
  const offer =
    typeof sp.offer === "string" && getOffer(sp.offer) ? sp.offer : null;

  return <Wizard initialMode={mode} initialOffer={offer} />;
}
