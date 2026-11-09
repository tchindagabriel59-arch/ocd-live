import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { bookings, studioSlots } from "@/db/schema";
import { bust } from "@/lib/cache";
import { getOffer, COUNTRIES, CATEGORIES } from "@/lib/catalog";
import { bookingSchema } from "@/lib/validation";
import { fullDay, slotRange, todayUtc } from "@/lib/format";

export const dynamic = "force-dynamic";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Référence publique courte et lisible à voix haute : OCD-7K2P9Q */
function genRef(): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `OCD-${s}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fields[key]) fields[key] = issue.message;
      }
      return NextResponse.json(
        { error: "Vérifie les champs du formulaire", fields },
        { status: 400 }
      );
    }
    const input = parsed.data;

    // L'offre doit exister et correspondre au mode choisi.
    const offer = getOffer(input.offerId);
    if (!offer || offer.mode !== input.mode) {
      return NextResponse.json({ error: "Offre invalide" }, { status: 400 });
    }

    // ——— Présentiel : le créneau doit être ouvert et libre ———
    let slotLabel: string | null = null;
    if (input.mode === "presentiel") {
      const [slot] = await db
        .select()
        .from(studioSlots)
        .where(eq(studioSlots.id, input.slotId!));

      if (!slot || slot.status !== "open" || slot.date < todayUtc()) {
        return NextResponse.json(
          { error: "Ce créneau n'est plus disponible", code: "SLOT_GONE" },
          { status: 409 }
        );
      }
      const [existing] = await db
        .select({ id: bookings.id })
        .from(bookings)
        .where(and(eq(bookings.slotId, slot.id), ne(bookings.status, "cancelled")))
        .limit(1);
      if (existing) {
        return NextResponse.json(
          { error: "Ce créneau vient d'être réservé", code: "SLOT_TAKEN" },
          { status: 409 }
        );
      }
      slotLabel = `${fullDay(slot.date)} · ${slotRange(slot.startTime, slot.endTime)}`;
    }

    // ——— Distance : libellé récap du hub ———
    if (input.mode === "distance") {
      const c = COUNTRIES.find((x) => x.code === input.country)?.name ?? "";
      const cat = CATEGORIES.find((x) => x.id === input.category)?.label ?? "";
      slotLabel = `${c} · ${cat} · Hub OCD`;
    }

    // Insertion avec réessai en cas de collision de référence.
    let inserted = null;
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      try {
        [inserted] = await db
          .insert(bookings)
          .values({
            reference: genRef(),
            mode: input.mode,
            slotId: input.mode === "presentiel" ? input.slotId : null,
            slotLabel,
            country: input.mode === "distance" ? input.country : null,
            category: input.mode === "distance" ? input.category : null,
            offerId: offer.id,
            offerName: offer.name,
            priceXof: offer.priceXof,
            name: input.name,
            whatsapp: input.whatsapp,
            business: input.business,
          })
          .returning();
      } catch (e) {
        const err = e as { code?: string; constraint?: string };
        // Un autre utilisateur a pris le slot entre-temps (index unique partiel)
        if (err.code === "23505" && err.constraint?.includes("active_slot")) {
          return NextResponse.json(
            { error: "Ce créneau vient d'être réservé", code: "SLOT_TAKEN" },
            { status: 409 }
          );
        }
        if (err.code !== "23505") throw e; // collision ref → nouvelle tentative
      }
    }
    if (!inserted) {
      return NextResponse.json({ error: "Réessaye dans un instant" }, { status: 500 });
    }

    bust("slots"); // le calendrier reflète immédiatement la prise de créneau

    return NextResponse.json(
      {
        booking: {
          reference: inserted.reference,
          mode: inserted.mode,
          offerName: inserted.offerName,
          priceXof: inserted.priceXof,
          slotLabel: inserted.slotLabel,
          name: inserted.name,
          whatsapp: inserted.whatsapp,
          business: inserted.business,
          status: inserted.status,
          liveStatus: inserted.liveStatus,
          createdAt: inserted.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("[POST /api/bookings]", e);
    return NextResponse.json(
      { error: "Erreur serveur — réessaye" },
      { status: 500 }
    );
  }
}
