import { NextResponse } from "next/server";
import { and, asc, eq, gte, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import { bookings, studioSlots } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/admin";
import { bust } from "@/lib/cache";
import { ensureSlots } from "@/lib/ensure-slots";
import { adminSlotActionSchema } from "@/lib/validation";
import { addUtcDays, dayParts, todayUtc, utcDay } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Planning studio 7 jours : état du créneau + réservation éventuelle. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();
  await ensureSlots();

  const from = todayUtc();
  const to = utcDay(addUtcDays(new Date(), 7));

  const rows = await db
    .select({
      slot: studioSlots,
      bId: bookings.id,
      bName: bookings.name,
      bRef: bookings.reference,
      bBusiness: bookings.business,
      bStatus: bookings.status,
      bOffer: bookings.offerName,
    })
    .from(studioSlots)
    .leftJoin(
      bookings,
      and(eq(bookings.slotId, studioSlots.id), ne(bookings.status, "cancelled"))
    )
    .where(and(gte(studioSlots.date, from), lt(studioSlots.date, to)))
    .orderBy(asc(studioSlots.date), asc(studioSlots.startTime));

  return NextResponse.json({
    days: groupByDay(rows),
  });
}

type Row = {
  slot: typeof studioSlots.$inferSelect;
  bId: string | null;
  bName: string | null;
  bRef: string | null;
  bBusiness: string | null;
  bStatus: string | null;
  bOffer: string | null;
};

function groupByDay(rows: Row[]) {
  const map = new Map<
    string,
    {
      date: string;
      wd: string;
      day: string;
      mo: string;
      isToday: boolean;
      slots: Array<Record<string, unknown>>;
    }
  >();
  for (const r of rows) {
    if (!map.has(r.slot.date)) {
      map.set(r.slot.date, { date: r.slot.date, ...dayParts(r.slot.date), slots: [] });
    }
    map.get(r.slot.date)!.slots.push({
      id: r.slot.id,
      start: r.slot.startTime,
      end: r.slot.endTime,
      status: r.slot.status,
      booking: r.bId
        ? {
            id: r.bId,
            name: r.bName,
            reference: r.bRef,
            business: r.bBusiness,
            status: r.bStatus,
            offer: r.bOffer,
          }
        : null,
    });
  }
  return [...map.values()];
}

/** Bloquer / rouvrir un créneau (impossible si une réservation active existe). */
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = adminSlotActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }
  const { id, status } = parsed.data;

  if (status === "blocked") {
    const [active] = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(and(eq(bookings.slotId, id), ne(bookings.status, "cancelled")))
      .limit(1);
    if (active) {
      return NextResponse.json(
        { error: "Annule d'abord la réservation liée à ce créneau" },
        { status: 409 }
      );
    }
  }

  const [updated] = await db
    .update(studioSlots)
    .set({ status })
    .where(eq(studioSlots.id, id))
    .returning({ id: studioSlots.id, status: studioSlots.status });

  if (!updated) {
    return NextResponse.json({ error: "Créneau introuvable" }, { status: 404 });
  }

  bust("slots");
  return NextResponse.json({ ok: true, ...updated });
}
