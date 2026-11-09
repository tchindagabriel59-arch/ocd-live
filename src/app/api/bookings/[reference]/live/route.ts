import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { liveUrlSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ reference: string }> };

/**
 * Soumission du lien de live par un vendeur à distance.
 * La référence du reçu fait office de secret porteur (style billetterie).
 * Le statut passe à "submitted" → file de validation dans la console Bovant.
 */
export async function PATCH(req: Request, { params }: Params) {
  const { reference } = await params;
  const body = await req.json().catch(() => null);
  const parsed = liveUrlSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Lien invalide" },
      { status: 400 }
    );
  }

  const [b] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.reference, reference.toUpperCase()))
    .limit(1);

  if (!b) return NextResponse.json({ error: "Reçu introuvable" }, { status: 404 });
  if (b.mode !== "distance")
    return NextResponse.json(
      { error: "Réservé aux lives à distance" },
      { status: 400 }
    );
  if (b.status === "cancelled")
    return NextResponse.json(
      { error: "Réservation annulée" },
      { status: 400 }
    );

  const [updated] = await db
    .update(bookings)
    .set({ liveUrl: parsed.data.url, liveStatus: "submitted" })
    .where(eq(bookings.id, b.id))
    .returning({ liveUrl: bookings.liveUrl, liveStatus: bookings.liveStatus });

  return NextResponse.json({ ok: true, ...updated });
}
