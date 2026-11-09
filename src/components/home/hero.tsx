"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Globe2, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { Logo } from "@/components/logo";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const STATS = [
  { icon: TrendingUp, value: "1 200+", label: "lives diffusés / mois" },
  { icon: Globe2, value: "12", label: "pays connectés au Hub" },
  { icon: Users, value: "480+", label: "vendeuses accompagnées" },
  { icon: Star, value: "4,9/5", label: "satisfaction vendeurs" },
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-14">
      {/* ——— Aurora de fond ——— */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,242,254,0.14),transparent)] blur-2xl" />
        <div className="absolute right-[-15%] bottom-[-10%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(255,0,80,0.16),transparent)] blur-3xl" />
        <div className="absolute top-1/3 left-[-12%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.1),transparent)] blur-3xl" />
        {/* grille fine */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 75% 60% at 50% 38%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 60% at 50% 38%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* ——— Lockup logo monumental avec anneaux orbitaux ——— */}
        <motion.div variants={item} className="relative mb-10 grid place-items-center">
          <div
            aria-hidden
            className="spin-slower absolute size-[240px] rounded-full border border-dashed border-white/12 sm:size-[300px]"
          />
          <div
            aria-hidden
            className="spin-rev absolute size-[290px] rounded-full border border-white/5 sm:size-[360px]"
          >
            <span className="bg-neon absolute -top-[3px] left-1/2 size-1.5 -translate-x-1/2 rounded-full shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
            <span className="bg-live absolute top-1/2 -right-[3px] size-1.5 -translate-y-1/2 rounded-full shadow-[0_0_14px_rgba(255,0,80,0.9)]" />
          </div>
          <div
            aria-hidden
            className="absolute size-[170px] rounded-full bg-[radial-gradient(closest-side,rgba(0,242,254,0.18),rgba(255,0,80,0.1)_55%,transparent)] blur-xl sm:size-[220px]"
          />
          <div className="floaty relative px-10 py-14 sm:px-14">
            <Logo size="xl" />
          </div>
        </motion.div>

        <motion.p variants={item} className="eyebrow text-neon mb-5">
          <span className="live-dot" />
          Live shopping · Studio Lomé &amp; Hub Afrique
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-[34px] leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl"
        >
          Ton business, en direct
          <br />
          devant <span className="text-grad-live">des milliers d&rsquo;acheteurs</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-mist mt-6 max-w-xl text-[15px] leading-relaxed text-pretty sm:text-lg"
        >
          Réserve une session d&rsquo;1h30 dans notre studio pro à Lomé — ou
          diffuse depuis ta propre boutique partout en Afrique. Simple comme un
          message WhatsApp.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 grid w-full max-w-md grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-2"
        >
          <Link href="/reserver?mode=presentiel" className="btn btn-primary sm:text-[15px]">
            <MapPin className="size-[18px]" strokeWidth={2.4} />
            Réserver au studio · Lomé
          </Link>
          <Link href="/reserver?mode=distance" className="btn btn-ghost sm:text-[15px]">
            <Globe2 className="text-neon size-[18px]" strokeWidth={2.4} />
            Diffuser à distance
          </Link>
        </motion.div>

        <motion.p variants={item} className="mt-4 text-xs text-white/40">
          Dès 2 500 XOF · Créneaux 08h–11h &amp; 18h–21h · Confirmation WhatsApp en 15 min
        </motion.p>

        {/* ——— Bandeau de preuve sociale ——— */}
        <motion.div
          variants={item}
          className="glass mt-12 grid w-full grid-cols-2 divide-x divide-white/5 rounded-3xl sm:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center gap-1 px-3 py-5 ${
                i >= 2 ? "border-t border-white/5 sm:border-t-0" : ""
              }`}
            >
              <span className="font-display inline-flex items-center gap-1.5 text-lg font-bold">
                <s.icon className="text-neon size-4" strokeWidth={2.4} />
                {s.value}
              </span>
              <span className="text-[11px] leading-tight text-white/45">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#modes"
        aria-label="Découvrir les deux modes"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-1 text-[11px] tracking-[0.2em] text-white/35 uppercase transition hover:text-white/70 sm:flex"
      >
        Explorer
        <ChevronDown className="size-3.5 animate-bounce" />
      </motion.a>
    </section>
  );
}
