/**
 * Catalogue statique OCD Live — données produit centralisées.
 * Garder ici tout ce qui ne nécessite pas la base de données.
 */

export type Mode = "presentiel" | "distance";

export const BRAND = {
  name: "OCD Live",
  founder: "Bovant",
  company: "House of Challenge",
  studioCity: "Lomé, Togo",
  whatsappDisplay: "+228 96 00 00 00",
  whatsappNumber: "22896000000",
} as const;

/** Fenêtres de diffusion quotidiennes (GMT) */
export const WINDOWS = [
  { id: "matin", label: "Matin", range: "08h00 – 11h00" },
  { id: "soir", label: "Soir", range: "18h00 – 21h00" },
] as const;

/** Découpage des fenêtres en créneaux de 1h30 */
export const SLOT_TIMES: Array<[string, string]> = [
  ["08:00", "09:30"],
  ["09:30", "11:00"],
  ["18:00", "19:30"],
  ["19:30", "21:00"],
];

export const COUNTRIES = [
  { code: "TG", name: "Togo" },
  { code: "CM", name: "Cameroun" },
  { code: "BJ", name: "Bénin" },
  { code: "TD", name: "Tchad" },
  { code: "CI", name: "Côte d’Ivoire" },
  { code: "SN", name: "Sénégal" },
  { code: "BF", name: "Burkina Faso" },
  { code: "GA", name: "Gabon" },
  { code: "CD", name: "RD Congo" },
  { code: "ML", name: "Mali" },
  { code: "NE", name: "Niger" },
  { code: "CG", name: "Congo" },
];

export const CATEGORIES = [
  { id: "mode", label: "Mode & Beauté", hint: "Pagnes, prêt-à-porter, cosmétiques" },
  { id: "food", label: "Nourriture", hint: "Plats, snacks, épices, jus" },
  { id: "services", label: "Services", hint: "Couture, coiffure, réparation, cours" },
  { id: "tech", label: "High-Tech", hint: "Téléphones, accessoires, gadgets" },
  { id: "artisanat", label: "Artisanat", hint: "Décoration, bijoux, fait-main" },
];

export interface Offer {
  id: string;
  mode: Mode;
  name: string;
  priceXof: number;
  period?: string; // "/mois"
  tagline: string;
  features: string[];
  popular?: boolean;
}

export const OFFERS: Offer[] = [
  // ——— Présentiel · Studio Lomé ———
  {
    id: "p_decouverte",
    mode: "presentiel",
    name: "Live Découverte",
    priceXof: 15000,
    tagline: "Pour tester la puissance du live",
    features: [
      "1 session studio de 1h30",
      "Lumière, régie & décor inclus",
      "1 replay offert pour tes réseaux",
    ],
  },
  {
    id: "p_pack4",
    mode: "presentiel",
    name: "Pack 4 Lives",
    priceXof: 49000,
    tagline: "La régularité qui fait vendre",
    popular: true,
    features: [
      "4 créneaux studio de 1h30",
      "Coaching vente de 30 min offert",
      "Diffusion sur la page OCD Live",
    ],
  },
  {
    id: "p_premium",
    mode: "presentiel",
    name: "Pack Premium 8 Lives",
    priceXof: 89000,
    tagline: "Pour dominer ta catégorie",
    features: [
      "8 créneaux studio de 1h30",
      "Coaching + script de vente",
      "Mise en avant sur la page d’accueil OCD",
    ],
  },
  // ——— Distance · Hub Afrique ———
  {
    id: "d_pass",
    mode: "distance",
    name: "Pass Live Unique",
    priceXof: 2500,
    tagline: "Un live pour te lancer",
    features: [
      "1 live de 1h30 depuis ta boutique",
      "Lien validé en direct par l’équipe",
      "Support WhatsApp pendant le live",
    ],
  },
  {
    id: "d_hub",
    mode: "distance",
    name: "Abonnement Hub",
    priceXof: 5000,
    period: "/mois",
    tagline: "L’essentiel pour vendre chaque jour",
    popular: true,
    features: [
      "Lives illimités dans les créneaux",
      "Ta boutique visible sur le Hub OCD",
      "Communauté & astuces vente",
    ],
  },
  {
    id: "d_pro",
    mode: "distance",
    name: "Hub Pro",
    priceXof: 12000,
    period: "/mois",
    tagline: "Visibilité maximale, stats en plus",
    features: [
      "Tout l’Abonnement Hub",
      "Bannière en tête du Hub",
      "Rapport d’audience mensuel",
    ],
  },
];

export function getOffer(id: string): Offer | undefined {
  return OFFERS.find((o) => o.id === id);
}

export function offersFor(mode: Mode): Offer[] {
  return OFFERS.filter((o) => o.mode === mode);
}
