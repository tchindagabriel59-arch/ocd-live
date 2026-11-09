import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, studioSlots } from "@/db/schema";
import { isAdmin, unauthorized } from "@/lib/admin";
import { bust } from "@/lib/cache";
import { COUNTRIES, CATEGORIES } from "@/lib/catalog";
import { adminBookingActionSchema } from "@/lib/validation";
import { fullDay, slotRange, todayUtc } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Liste complète + KPIs pour la console Bovant. */
export async function GET(req: Request) {
  if (!isAdmin(req)) return unauthorized();

  const rows = await db
    .select({
      b: bookings,
      slotDate: studioSlots.date,
      slotStart: studioSlots.startTime,
      slotEnd: studioSlots.endTime,
    })
    .from(bookings)
    .leftJoin(studioSlots, eq(bookings.slotId, studioSlots.id))
    .orderBy(desc(bookings.createdAt))
    .limit(300);

  const agg = await db
    .select({
      status: bookings.status,
      n: sql<number>`count(*)::int`,
      rev: sql<number>`coalesce(sum(${bookings.priceXof}), 0)::int`,
    })
    .from(bookings)
    .groupBy(bookings.status);

  const [todayRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bookings)
    .where(sql`${bookings.createdAt} >= ${new Date(todayUtc() + "T00:00:00Z")}`);

  const stats = {
    today: todayRow?.n ?? 0,
    pending: agg.find((a) => a.status === "pending")?.n ?? 0,
    confirmed: agg.find((a) => a.status === "confirmed")?.n ?? 0,
    cancelled: agg.find((a) => a.status === "cancelled")?.n ?? 0,
    revenue: agg
      .filter((a) => a.status !== "cancelled")
      .reduce((s, a) => s + a.rev, 0),
    liveQueue: rows.filter(
      (r) => r.b.mode === "distance" && r.b.liveStatus === "submitted"
    ).length,
  };

  return NextResponse.json({
    stats,
    bookings: rows.map(({ b, slotDate, slotStart, slotEnd }) => ({
      id: b.id,
      reference: b.reference,
      mode: b.mode,
      slotLabel:
        b.slotLabel ??
        (slotDate
          ? `${fullDay(slotDate)} · ${slotRange(slotStart!, slotEnd!)}`
          : null),
      country: b.country
        ? COUNTRIES.find((c) => c.code === b.country)?.name ?? b.country
        : null,
      category: b.category
        ? CATEGORIES.find((c) => c.id === b.category)?.label ?? b.category
        : null,
      offerName: b.offerName,
      priceXof: b.priceXof,
      name: b.name,
      whatsapp: b.whatsapp,
      business: b.business,
      status: b.status,
      liveUrl: b.liveUrl,
      liveStatus: b.liveStatus,
      createdAt: b.createdAt,
    })),
  });
}

/** Actions : confirmer / annuler une réservation, valider un lien de live. */
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = adminBookingActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }
  const { id, action } = parsed.data;

  const patch: Partial<typeof bookings.$inferInsert> = {};
  if (action === "confirm") patch.status = "confirmed";
  if (action === "cancel") patch.status = "cancelled";
  if (action === "validate_live") patch.liveStatus = "validated";
  if (action === "reject_live") patch.liveStatus = "rejected";

  const [updated] = await db
    .update(bookings)
    .set(patch)
    .where(eq(bookings.id, id))
    .returning({ id: bookings.id, status: bookings.status, liveStatus: bookings.liveStatus });

  if (!updated) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  bust("slots"); // une annulation libère le créneau immédiatement
  return NextResponse.json({ ok: true, ...updated });
}
