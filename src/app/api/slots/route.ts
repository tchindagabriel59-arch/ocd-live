import { NextResponse } from "next/server";
import { and, asc, gte, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import { bookings, studioSlots } from "@/db/schema";
import { cached } from "@/lib/cache";
import { ensureSlots } from "@/lib/ensure-slots";
import { dayParts, todayUtc } from "@/lib/format";

export const dynamic = "force-dynamic";

export interface SlotDto {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

export interface DayDto {
  date: string;
  wd: string;
  day: string;
  mo: string;
  isToday: boolean;
  slots: SlotDto[];
}

async function load(): Promise<{ days: DayDto[] }> {
  await ensureSlots(); // calendrier auto-alimenté, sans cron
  const today = todayUtc();

  const rows = await db
    .select()
    .from(studioSlots)
    .where(gte(studioSlots.date, today))
    .orderBy(asc(studioSlots.date), asc(studioSlots.startTime));

  const ids = rows.map((r) => r.id);
  const takenRows = ids.length
    ? await db
        .select({ slotId: bookings.slotId })
        .from(bookings)
        .where(and(inArray(bookings.slotId, ids), ne(bookings.status, "cancelled")))
    : [];
  const taken = new Set(takenRows.map((t) => t.slotId));

  const map = new Map<string, DayDto>();
  for (const s of rows) {
    if (!map.has(s.date)) {
      const p = dayParts(s.date);
      map.set(s.date, { date: s.date, ...p, slots: [] });
    }
    map.get(s.date)!.slots.push({
      id: s.id,
      start: s.startTime,
      end: s.endTime,
      available: s.status === "open" && !taken.has(s.id),
    });
  }
  return { days: [...map.values()] };
}

/** Calendrier public des disponibilités — cache 8 s pour encaisser les pics. */
export async function GET() {
  try {
    const data = await cached("slots", 8_000, load);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[GET /api/slots]", e);
    return NextResponse.json({ error: "Calendrier indisponible" }, { status: 500 });
  }
}
