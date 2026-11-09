import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Créneaux studio de 1h30 (présentiel — Lomé).
 * Fenêtres de diffusion : 08h00–11h00 et 18h00–21h00 (GMT).
 * La disponibilité est dérivée : un slot est "pris" s'il existe une
 * réservation active (status != 'cancelled') qui le référence.
 */
export const studioSlots = pgTable(
  "studio_slots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: text("date").notNull(), // ISO "YYYY-MM-DD" (UTC) — simple et fiable côté mobile
    startTime: text("start_time").notNull(), // "08:00"
    endTime: text("end_time").notNull(), // "09:30"
    durationMin: integer("duration_min").notNull().default(90),
    status: text("status", { enum: ["open", "blocked"] })
      .notNull()
      .default("open"),
  },
  (t) => [
    uniqueIndex("studio_slots_date_time_uq").on(t.date, t.startTime),
    index("studio_slots_date_idx").on(t.date),
  ]
);

/**
 * Réservations émises par le wizard (présentiel + hub à distance).
 * Le `reference` court (OCD-XXXXXX) sert d'identifiant public sur les reçus
 * et de clé pour la soumission du lien de live à distance.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reference: text("reference").notNull().unique(),
    mode: text("mode", { enum: ["presentiel", "distance"] }).notNull(),

    // Présentiel
    slotId: uuid("slot_id").references(() => studioSlots.id),
    slotLabel: text("slot_label"), // "sam. 14 juin · 18h00–19h30"

    // Distance
    country: text("country"), // code ISO 2 lettres
    category: text("category"), // id catégorie

    // Offre (figée au moment de la réservation)
    offerId: text("offer_id").notNull(),
    offerName: text("offer_name").notNull(),
    priceXof: integer("price_xof").notNull(),

    // Contact
    name: text("name").notNull(),
    whatsapp: text("whatsapp").notNull(),
    business: text("business").notNull(),

    status: text("status", {
      enum: ["pending", "confirmed", "cancelled"],
    })
      .notNull()
      .default("pending"),

    // Lien de live soumis par un vendeur à distance (validé par Bovant)
    liveUrl: text("live_url"),
    liveStatus: text("live_status", {
      enum: ["none", "submitted", "validated", "rejected"],
    })
      .notNull()
      .default("none"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("bookings_status_idx").on(t.status),
    index("bookings_mode_idx").on(t.mode),
    index("bookings_created_idx").on(t.createdAt),
    index("bookings_slot_idx").on(t.slotId),
  ]
);

export type StudioSlot = typeof studioSlots.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
