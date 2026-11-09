"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  CalendarClock,
  Check,
  ExternalLink,
  LayoutDashboard,
  Link2,
  ListChecks,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  Video,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/catalog";
import { fmtXOF, slotRange, timeAgo } from "@/lib/format";

/* ————————— Types (payloads API admin) ————————— */

interface AdminBooking {
  id: string;
  reference: string;
  mode: "presentiel" | "distance";
  slotLabel: string | null;
  country: string | null;
  category: string | null;
  offerName: string;
  priceXof: number;
  name: string;
  whatsapp: string;
  business: string;
  status: "pending" | "confirmed" | "cancelled";
  liveUrl: string | null;
  liveStatus: "none" | "submitted" | "validated" | "rejected";
  createdAt: string;
}

interface AdminData {
  stats: {
    today: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    revenue: number;
    liveQueue: number;
  };
  bookings: AdminBooking[];
}

interface AdminSlot {
  id: string;
  start: string;
  end: string;
  status: "open" | "blocked";
  booking: {
    id: string;
    name: string | null;
    reference: string | null;
    business: string | null;
    status: string | null;
    offer: string | null;
  } | null;
}

interface AdminDay {
  date: string;
  wd: string;
  day: string;
  mo: string;
  isToday: boolean;
  slots: AdminSlot[];
}

type Tab = "resa" | "lives" | "planning";

const STATUS_UI: Record<AdminBooking["status"], { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-amber-400/10 text-amber-300 ring-amber-300/25" },
  confirmed: { label: "Confirmée", cls: "bg-neon/10 text-neon ring-neon/30" },
  cancelled: { label: "Annulée", cls: "bg-live/10 text-live ring-live/30" },
};

const LIVE_UI: Record<string, { label: string; cls: string }> = {
  submitted: { label: "À valider", cls: "bg-amber-400/10 text-amber-300 ring-amber-300/25" },
  validated: { label: "Validé", cls: "bg-neon/10 text-neon ring-neon/30" },
  rejected: { label: "Refusé", cls: "bg-live/10 text-live ring-live/30" },
};

/** Console Bovant — validation temps réel des lives + pilotage studio. */
export function AdminApp({ demoHint }: { demoHint: boolean }) {
  const [code, setCode] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateShake, setGateShake] = useState(0);
  const [booting, setBooting] = useState(false);

  const [tab, setTab] = useState<Tab>("resa");
  const [filter, setFilter] = useState<"all" | AdminBooking["status"]>("all");
  const [data, setData] = useState<AdminData | null>(null);
  const [planning, setPlanning] = useState<AdminDay[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const headers = useCallback(
    (c: string) => ({ "x-admin-code": c, "Content-Type": "application/json" }),
    []
  );

  const loadAll = useCallback(
    async (c: string) => {
      const [br, sr] = await Promise.all([
        fetch("/api/admin/bookings", { headers: headers(c), cache: "no-store" }),
        fetch("/api/admin/slots", { headers: headers(c), cache: "no-store" }),
      ]);
      if (br.status === 401 || sr.status === 401) throw new Error("401");
      if (!br.ok || !sr.ok) throw new Error("500");
      setData((await br.json()) as AdminData);
      setPlanning((await sr.json()).days as AdminDay[]);
      setLastSync(new Date());
    },
    [headers]
  );

  // Session persistée (localStorage) — console pensée mobile
  useEffect(() => {
    const saved = localStorage.getItem("ocd_admin_code");
    if (!saved) return;
    setBooting(true);
    loadAll(saved)
      .then(() => setCode(saved))
      .catch(() => localStorage.removeItem("ocd_admin_code"))
      .finally(() => setBooting(false));
  }, [loadAll]);

  // Auto-refresh : la console "respire" pendant les fenêtres live
  useEffect(() => {
    if (!code) return;
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => loadAll(code).catch(() => {}), 12_000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [code, loadAll]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || booting) return;
    setBooting(true);
    setGateError(null);
    try {
      await loadAll(input.trim());
      localStorage.setItem("ocd_admin_code", input.trim());
      setCode(input.trim());
    } catch (err) {
      setGateError(
        err instanceof Error && err.message === "401"
          ? "Code incorrect — réessaie"
          : "Serveur indisponible"
      );
      setGateShake((n) => n + 1);
    } finally {
      setBooting(false);
    }
  }

  async function act(id: string, action: "confirm" | "cancel" | "validate_live" | "reject_live") {
    if (!code || busyId) return;
    setBusyId(id + action);
    // Optimiste : la console reste instantanée même en 3G
    setData((d) =>
      d
        ? {
            stats: d.stats,
            bookings: d.bookings.map((b) => {
              if (b.id !== id) return b;
              if (action === "confirm") return { ...b, status: "confirmed" };
              if (action === "cancel") return { ...b, status: "cancelled" };
              if (action === "validate_live") return { ...b, liveStatus: "validated" };
              return { ...b, liveStatus: "rejected" };
            }),
          }
        : d
    );
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: headers(code),
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error();
      await loadAll(code);
    } catch {
      setToast("Action impossible — synchronisation…");
      await loadAll(code).catch(() => {});
    } finally {
      setBusyId(null);
    }
  }

  async function toggleSlot(id: string, status: "open" | "blocked") {
    if (!code || busyId) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "PATCH",
        headers: headers(code),
        body: JSON.stringify({ id, status }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast(body.error ?? "Action impossible");
        return;
      }
      await loadAll(code);
    } catch {
      setToast("Réseau instable — réessaye");
    } finally {
      setBusyId(null);
    }
  }

  /* ————————— Écran d'accès ————————— */
  if (!code) {
    return (
      <main className="relative flex min-h-svh items-center justify-center px-4">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,0,80,0.12),transparent)] blur-2xl" />
        </div>
        <motion.div
          key={gateShake}
          animate={gateShake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-deep edge-top relative w-full max-w-sm rounded-[28px] p-7"
        >
          <Logo size="lg" />
          <h1 className="font-display mt-6 text-xl font-extrabold tracking-tight">
            Console {BRAND.founder}
          </h1>
          <p className="text-mist mt-1.5 text-sm">
            Valide les lives à distance et pilote le planning du studio.
          </p>

          <form onSubmit={login} className="mt-6 space-y-3">
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                inputMode="text"
                autoComplete="off"
                placeholder="Code d'accès"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`field pl-11 ${gateError ? "field-error" : ""}`}
              />
            </div>
            {gateError && <p className="text-live pl-1 text-xs font-medium">{gateError}</p>}
            <button type="submit" disabled={booting} className="btn btn-primary w-full text-[15px]">
              {booting ? <Loader2 className="size-5 animate-spin" /> : <BadgeCheck className="size-5" strokeWidth={2.4} />}
              Ouvrir la console
            </button>
          </form>

          {demoHint && (
            <p className="glass mt-4 rounded-xl px-3 py-2.5 text-center text-[11px] text-white/50">
              Mode démo — code : <span className="text-neon font-bold">bovant-2026</span>
            </p>
          )}
        </motion.div>
      </main>
    );
  }

  /* ————————— Console ————————— */
  const bookings = useMemo(() => {
    const all = data?.bookings ?? [];
    return filter === "all" ? all : all.filter((b) => b.status === filter);
  }, [data, filter]);

  const liveRows = useMemo(() => {
    const rows = (data?.bookings ?? []).filter((b) => b.mode === "distance" && b.liveStatus !== "none");
    return {
      queue: rows.filter((b) => b.liveStatus === "submitted"),
      history: rows.filter((b) => b.liveStatus !== "submitted"),
    };
  }, [data]);

  const kpis = data?.stats;

  return (
    <main className="min-h-svh pb-24">
      {/* Barre console */}
      <div className="glass-deep sticky top-0 z-40 border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden text-[10px] font-extrabold tracking-[0.24em] text-white/40 uppercase sm:inline">
              Console {BRAND.founder}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadAll(code).catch(() => setToast("Sync impossible"))}
              className="glass grid size-10 place-items-center rounded-xl transition hover:bg-white/10"
              aria-label="Actualiser"
            >
              <RefreshCw className="size-4 text-white/70" />
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("ocd_admin_code");
                setCode(null);
                setData(null);
              }}
              className="glass grid size-10 place-items-center rounded-xl transition hover:bg-white/10"
              aria-label="Fermer la session"
            >
              <LogOut className="size-4 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: CalendarClock, label: "Résas aujourd’hui", value: kpis?.today ?? "—", tint: "text-neon" },
            { icon: Loader2, label: "En attente", value: kpis?.pending ?? "—", tint: "text-amber-300" },
            { icon: BadgeCheck, label: "Confirmées", value: kpis?.confirmed ?? "—", tint: "text-neon" },
            { icon: TrendingUp, label: "CA cumulé", value: kpis ? fmtXOF(kpis.revenue) : "—", tint: "text-mag" },
          ].map((k) => (
            <div key={k.label} className="glass rounded-2xl p-4">
              <k.icon className={`size-4 ${k.tint}`} strokeWidth={2.4} />
              <p className="font-display mt-2.5 text-xl font-extrabold tracking-tight">{k.value}</p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-white/40 uppercase">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div className="glass mt-6 grid grid-cols-3 gap-1 rounded-2xl p-1">
          {(
            [
              { id: "resa", label: "Réservations", icon: ListChecks, badge: kpis?.pending },
              { id: "lives", label: "Lives distance", icon: Video, badge: kpis?.liveQueue },
              { id: "planning", label: "Planning", icon: CalendarClock },
            ] as Array<{ id: Tab; label: string; icon: typeof ListChecks; badge?: number }>
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl text-[12px] font-bold transition-colors sm:text-[13px] ${
                tab === t.id ? "text-white" : "text-white/45 hover:text-white/70"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-white/8 ring-1 ring-white/12 ring-inset"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <t.icon className="relative size-4" strokeWidth={2.4} />
              <span className="relative">{t.label}</span>
              {!!t.badge && (
                <span className="bg-live relative grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-3 text-right text-[10px] text-white/30">
          {lastSync ? `Synchro ${lastSync.toLocaleTimeString("fr-FR")}` : "Synchronisation…"} · auto 12 s
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-2"
          >
            {/* ——— RÉSERVATIONS ——— */}
            {tab === "resa" && (
              <div>
                <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                  {(
                    [
                      ["all", "Toutes"],
                      ["pending", "En attente"],
                      ["confirmed", "Confirmées"],
                      ["cancelled", "Annulées"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                        filter === id
                          ? "from-live to-mag bg-gradient-to-r shadow-[0_8px_20px_-8px_rgba(255,0,80,0.6)]"
                          : "glass text-white/60"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {bookings.length === 0 && (
                    <EmptyState label="Aucune réservation dans ce filtre" />
                  )}
                  {bookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      b={b}
                      busy={busyId?.startsWith(b.id) ?? false}
                      onAct={act}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ——— LIVES À DISTANCE ——— */}
            {tab === "lives" && (
              <div className="space-y-6">
                <div>
                  <p className="eyebrow text-mag mb-3">File de validation — fenêtres 08h–11h &amp; 18h–21h</p>
                  {liveRows.queue.length === 0 ? (
                    <EmptyState label="Aucun lien en attente de validation" />
                  ) : (
                    <div className="space-y-3">
                      {liveRows.queue.map((b) => (
                        <LiveCard key={b.id} b={b} busy={busyId === b.id + "validate_live" || busyId === b.id + "reject_live"} onAct={act} />
                      ))}
                    </div>
                  )}
                </div>
                {liveRows.history.length > 0 && (
                  <div>
                    <p className="eyebrow mb-3 text-white/40">Historique</p>
                    <div className="space-y-3">
                      {liveRows.history.map((b) => (
                        <LiveCard key={b.id} b={b} busy={false} onAct={act} readonly />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ——— PLANNING STUDIO ——— */}
            {tab === "planning" && (
              <div className="space-y-5">
                {(planning ?? []).slice(0, 7).map((d) => (
                  <div key={d.date}>
                    <p className="eyebrow mb-2.5 text-white/50">
                      {d.isToday ? "Aujourd’hui" : `${d.wd.replace(".", "")} ${d.day} ${d.mo}`}
                    </p>
                    <div className="space-y-2">
                      {d.slots.map((s) => {
                        const taken = !!s.booking;
                        return (
                          <div
                            key={s.id}
                            className={`flex items-center gap-3 rounded-2xl p-3.5 ${taken ? "glass-deep" : "glass"}`}
                          >
                            <span className="font-display w-[92px] shrink-0 text-sm font-bold">
                              {slotRange(s.start, s.end)}
                            </span>
                            <div className="min-w-0 flex-1">
                              {taken ? (
                                <>
                                  <p className="truncate text-sm font-semibold">
                                    {s.booking!.name} · <span className="text-neon">{s.booking!.reference}</span>
                                  </p>
                                  <p className="truncate text-xs text-white/45">
                                    {s.booking!.offer}
                                  </p>
                                </>
                              ) : (
                                <p className={`text-xs font-bold tracking-wide uppercase ${s.status === "blocked" ? "text-live" : "text-white/40"}`}>
                                  {s.status === "blocked" ? "Bloqué" : "Libre"}
                                </p>
                              )}
                            </div>
                            {!taken && (
                              <button
                                type="button"
                                disabled={busyId === s.id}
                                onClick={() => toggleSlot(s.id, s.status === "open" ? "blocked" : "open")}
                                className={`btn !min-h-[38px] shrink-0 !rounded-xl px-3 text-[11px] ${
                                  s.status === "open" ? "btn-ghost" : "btn-primary"
                                }`}
                              >
                                {busyId === s.id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : s.status === "open" ? (
                                  <>
                                    <Ban className="size-3.5" /> Bloquer
                                  </>
                                ) : (
                                  <>
                                    <Check className="size-3.5" strokeWidth={3} /> Rouvrir
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-x-4 bottom-8 z-50 mx-auto max-w-sm"
          >
            <div className="glass-deep border-live/30 rounded-2xl border px-4 py-3 text-sm font-medium">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ————————— Sous-composants ————————— */

function EmptyState({ label }: { label: string }) {
  return (
    <div className="glass rounded-3xl px-6 py-10 text-center">
      <LayoutDashboard className="mx-auto size-6 text-white/25" />
      <p className="mt-3 text-sm text-white/45">{label}</p>
    </div>
  );
}

function BookingCard({
  b,
  busy,
  onAct,
}: {
  b: AdminBooking;
  busy: boolean;
  onAct: (id: string, a: "confirm" | "cancel" | "validate_live" | "reject_live") => void;
}) {
  const st = STATUS_UI[b.status];
  return (
    <article className="glass rounded-3xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-extrabold tracking-wide">{b.reference}</p>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-[0.12em] uppercase ring-1 ring-inset ${st.cls}`}>
          {st.label}
        </span>
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {b.name}
            <span className="text-mist font-normal"> · {b.whatsapp}</span>
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/45">{b.business}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase ${
            b.mode === "presentiel" ? "bg-live/10 text-live" : "bg-neon/10 text-neon"
          }`}
        >
          {b.mode === "presentiel" ? "Studio" : "Hub"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-white/55">
        <span className="font-semibold text-white/85">{b.offerName}</span>
        <span className="text-mag font-bold">{fmtXOF(b.priceXof)}</span>
        {b.slotLabel && <span className="text-white/40">{b.slotLabel}</span>}
        {b.country && (
          <span className="text-white/40">
            {b.country} · {b.category}
          </span>
        )}
        <span className="ml-auto text-white/30">{timeAgo(b.createdAt)}</span>
      </div>

      {b.status !== "cancelled" && (
        <div className="mt-3.5 flex gap-2">
          {b.status === "pending" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAct(b.id, "confirm")}
              className="btn btn-neon !min-h-[42px] flex-1 !rounded-xl text-xs"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" strokeWidth={2.6} />}
              Confirmer
            </button>
          )}
          <a
            href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour ${b.name.split(" ")[0]}, ici ${BRAND.founder} (OCD Live) au sujet de ta réservation ${b.reference}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost !min-h-[42px] !rounded-xl px-3.5 text-xs"
            aria-label="Écrire sur WhatsApp"
          >
            <MessageCircle className="size-4" />
          </a>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAct(b.id, "cancel")}
            className="btn btn-ghost !min-h-[42px] !rounded-xl px-3.5 text-xs text-live/80 hover:!border-live/40"
          >
            <Ban className="size-4" />
            Annuler
          </button>
        </div>
      )}
    </article>
  );
}

function LiveCard({
  b,
  busy,
  onAct,
  readonly = false,
}: {
  b: AdminBooking;
  busy: boolean;
  onAct: (id: string, a: "confirm" | "cancel" | "validate_live" | "reject_live") => void;
  readonly?: boolean;
}) {
  const ui = LIVE_UI[b.liveStatus];
  let host = "";
  try {
    host = b.liveUrl ? new URL(b.liveUrl).hostname.replace("www.", "") : "";
  } catch {
    host = "";
  }
  return (
    <article className={`rounded-3xl p-4 ${b.liveStatus === "submitted" ? "glass-deep edge-top" : "glass"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <Link2 className="text-neon size-4 shrink-0" strokeWidth={2.4} />
          <span className="truncate">{b.name}</span>
          <span className="shrink-0 text-white/35">{b.country}</span>
        </p>
        <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-[0.12em] uppercase ring-1 ring-inset ${ui.cls}`}>
          {ui.label}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-white/45">
        {b.reference} · {b.offerName} · {b.category}
      </p>
      {b.liveUrl && (
        <a
          href={b.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="hover:border-neon/50 mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-3.5 py-3 text-sm transition"
        >
          <span className="truncate text-white/80">{b.liveUrl}</span>
          <span className="text-neon inline-flex shrink-0 items-center gap-1 text-xs font-bold">
            {host || "Ouvrir"}
            <ExternalLink className="size-3.5" />
          </span>
        </a>
      )}
      {!readonly && b.liveStatus === "submitted" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAct(b.id, "validate_live")}
            className="btn btn-neon !min-h-[44px] !rounded-xl text-xs"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" strokeWidth={3} />}
            Valider le live
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAct(b.id, "reject_live")}
            className="btn btn-ghost !min-h-[44px] !rounded-xl text-xs text-live/80 hover:!border-live/40"
          >
            <ArrowLeft className="size-4" />
            Refuser
          </button>
        </div>
      )}
    </article>
  );
}
