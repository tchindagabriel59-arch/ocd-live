import { db } from "@/db";
import { studioSlots } from "@/db/schema";
import { SLOT_TIMES } from "./catalog";
import { addUtcDays, utcDay } from "./format";

/**
 * Garantit que les 14 prochains jours possèdent leurs 4 créneaux de 1h30.
 * Idempotent (INSERT … ON CONFLICT DO NOTHING) — appelé à chaque lecture du
 * calendrier, ce qui évite tout cron et garde le planning toujours rempli.
 */
export async function ensureSlots(daysAhead = 14): Promise<void> {
  const now = new Date();
  const values = Array.from({ length: daysAhead }, (_, i) =>
    utcDay(addUtcDays(now, i))
  ).flatMap((date) =>
    SLOT_TIMES.map(([startTime, endTime]) => ({ date, startTime, endTime }))
  );

  await db
    .insert(studioSlots)
    .values(values)
    .onConflictDoNothing({
      target: [studioSlots.date, studioSlots.startTime],
    });
}
