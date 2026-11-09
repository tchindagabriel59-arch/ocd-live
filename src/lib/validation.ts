import { z } from "zod";
import { COUNTRIES, CATEGORIES } from "./catalog";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];
const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];

export const phoneRegex = /^\+?[0-9][0-9\s.-]{6,17}$/;

/** Bloc contact — réutilisé tel quel par le wizard (validation instantanée). */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ton nom complet (2 caractères min.)")
    .max(60, "Nom trop long"),
  whatsapp: z
    .string()
    .trim()
    .regex(phoneRegex, "Numéro invalide — ex : +228 90 12 34 56"),
  business: z
    .string()
    .trim()
    .min(10, "Décris ton business en au moins 10 caractères")
    .max(160, "160 caractères max."),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Payload complet du wizard → POST /api/bookings */
export const bookingSchema = contactSchema
  .extend({
    mode: z.enum(["presentiel", "distance"]),
    slotId: z.string().uuid().optional(),
    country: z.enum(countryCodes).optional(),
    category: z.enum(categoryIds).optional(),
    offerId: z.string().min(1, "Choisis une offre"),
  })
  .superRefine((v, ctx) => {
    if (v.mode === "presentiel" && !v.slotId) {
      ctx.addIssue({
        code: "custom",
        path: ["slotId"],
        message: "Choisis un créneau studio",
      });
    }
    if (v.mode === "distance") {
      if (!v.country)
        ctx.addIssue({
          code: "custom",
          path: ["country"],
          message: "Choisis ton pays",
        });
      if (!v.category)
        ctx.addIssue({
          code: "custom",
          path: ["category"],
          message: "Choisis ta catégorie",
        });
    }
  });

export type BookingInput = z.infer<typeof bookingSchema>;

/** Soumission publique d'un lien de live (vendeur à distance) */
export const liveUrlSchema = z.object({
  url: z.url("Lien invalide — commence par https://").max(300, "Lien trop long"),
});

/** Actions du back-office Bovant */
export const adminBookingActionSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["confirm", "cancel", "validate_live", "reject_live"]),
});

export const adminSlotActionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "blocked"]),
});
