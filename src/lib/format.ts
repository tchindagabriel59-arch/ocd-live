/** Helpers de formatage — locale fr, fuseau UTC (Togo = GMT). */

export function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addUtcDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

export function todayUtc(): string {
  return utcDay(new Date());
}

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function fmtXOF(n: number): string {
  return `${nf.format(n)} XOF`;
}

export interface DayParts {
  wd: string; // "sam."
  day: string; // "14"
  mo: string; // "juin"
  isToday: boolean;
}

export function dayParts(iso: string): DayParts {
  const d = new Date(`${iso}T00:00:00Z`);
  const wd = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    timeZone: "UTC",
  }).format(d);
  const day = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    timeZone: "UTC",
  }).format(d);
  const mo = new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    timeZone: "UTC",
  }).format(d);
  return { wd, day, mo: mo.replace(".", ""), isToday: iso === todayUtc() };
}

export function fullDay(iso: string): string {
  const p = dayParts(iso);
  return `${p.wd} ${p.day} ${p.mo}`.replace(".", "");
}

/** "18:00" → "18h00" */
export function h(t: string): string {
  return t.replace(":", "h");
}

export function slotRange(start: string, end: string): string {
  return `${h(start)}–${h(end)}`;
}

export function maskPhone(p: string): string {
  const clean = p.trim();
  if (clean.length <= 7) return clean;
  return `${clean.slice(0, 5)}•••${clean.slice(-2)}`;
}

export function timeAgo(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (s < 60) return "à l’instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const hh = Math.floor(m / 60);
  if (hh < 24) return `il y a ${hh} h`;
  const j = Math.floor(hh / 24);
  return `il y a ${j} j`;
}
