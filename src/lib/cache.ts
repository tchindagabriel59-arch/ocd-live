/**
 * Cache mémoire TTL ultra-léger pour absorber les pics d'affluence
 * (équivalent plug-and-play d'Upstash/Redis en mono-instance).
 * Les mutations (réservation, blocage slot) invalident par préfixe.
 */

interface Entry {
  v: unknown;
  exp: number;
}

const g = globalThis as typeof globalThis & { __ocdCache?: Map<string, Entry> };
const store = (g.__ocdCache ??= new Map<string, Entry>());

export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.exp > Date.now()) return hit.v as T;
  const v = await fn();
  store.set(key, { v, exp: Date.now() + ttlMs });
  return v;
}

export function bust(prefix: string): void {
  for (const k of [...store.keys()]) {
    if (k.startsWith(prefix)) store.delete(k);
  }
}
