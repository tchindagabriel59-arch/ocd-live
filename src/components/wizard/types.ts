import type { Mode } from "@/lib/catalog";

/** Réponse de POST /api/bookings — affichée sur le reçu */
export interface BookingResult {
  reference: string;
  mode: Mode;
  offerName: string;
  priceXof: number;
  slotLabel: string | null;
  name: string;
  whatsapp: string;
  business: string;
  status: "pending" | "confirmed" | "cancelled";
  liveStatus: "none" | "submitted" | "validated" | "rejected";
  createdAt: string;
}

export interface SlotVm {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

export interface DayVm {
  date: string;
  wd: string;
  day: string;
  mo: string;
  isToday: boolean;
  slots: SlotVm[];
}

export type FieldErrors = Partial<Record<"name" | "whatsapp" | "business", string>>;
