import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { maskPhone } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ reference: string }> };

/** Reçu public partageable — téléphone masqué, aucune donnée sensible. */
export async function GET(_req: Request, { params }: Params) {
  const { reference } = await params;
  const [b] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference.toUpperCase()))
    .limit(1);

  if (!b) {
    return NextResponse.json({ error: "Reçu introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    booking: {
      reference: b.reference,
      mode: b.mode,
      offerName: b.offerName,
      priceXof: b.priceXof,
      slotLabel: b.slotLabel,
      country: b.country,
      category: b.category,
      name: b.name,
      whatsapp: maskPhone(b.whatsapp),
      status: b.status,
      liveStatus: b.liveStatus,
      createdAt: b.createdAt,
    },
  });
}
