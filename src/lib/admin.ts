import { NextResponse } from "next/server";

/**
 * Garde d'accès du back-office Bovant.
 * Le code est lu depuis ADMIN_CODE (fallback démo : "bovant-2026")
 * et transmis par le client via l'en-tête `x-admin-code`.
 */
const EXPECTED = () => process.env.ADMIN_CODE ?? "bovant-2026";

export function isAdmin(req: Request): boolean {
  const code = req.headers.get("x-admin-code");
  return !!code && code === EXPECTED();
}

export function unauthorized() {
  return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
}
