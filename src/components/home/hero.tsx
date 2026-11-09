"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Calendar, PlayCircle } from "lucide-react";

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16 text-center">
      {/* Photo de fond du studio (studio-bg.jpg) - 100% VISIBLE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!imgError ? (
          <Image
            src="/studio-bg.jpg"
            alt="Studio OCD Live Lomé"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center scale-100 transition-opacity duration-700 opacity-100 brightness-105 saturate-110"
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Lers fondu aux bords pour raccorder le header et footer sans cacher le centre */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#090a0f] via-[#090a0f]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/60 to-transparent pointer-events-none" />
      </div>

      {/* Contenu principal dans une carte en verre translucide */}
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="glass-deep backdrop-blur-md bg-black/60 border border-white/15 p-6 sm:p-12 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          {/* Badge du haut */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>LIVE SHOPPING · STUDIO LOMÉ & HUB AFRIQUE</span>
          </motion.div>

          {/* Titre Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-800 tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
          >
            Ton business, <br className="hidden sm:block" />
            en direct <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              devant des milliers
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,0,80,0.5)]">
              d&apos;acheteurs
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-200 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            Réserve une session d&apos;1h30 dans notre studio pro à Lomé — ou diffuse depuis ta propre boutique partout en Afrique. Simple comme un message WhatsApp.
          </motion.p>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/reserver?mode=presentiel"
              className="btn btn-primary w-full sm:w-auto !px-8 !py-4 !text-base shadow-[0_0_35px_rgba(255,0,80,0.5)] hover:shadow-[0_0_50px_rgba(255,0,80,0.8)] transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="h-5 w-5" />
              Réserver au Studio de Lomé
            </Link>
            <Link
              href="/reserver?mode=distance"
              className="btn glass border-amber-400/40 hover:border-amber-400 w-full sm:w-auto !px-8 !py-4 !text-base text-white bg-amber-500/10 hover:bg-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <PlayCircle className="h-5 w-5 text-amber-400" />
              Live à distance (Hub Afrique)
            </Link>
          </motion.div>

          {/* Statistiques clés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/10 pt-6"
          >
            <div className="text-center border-r border-white/10 pr-2 sm:pr-4">
              <div className="font-display text-xl sm:text-3xl font-700 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">56+</div>
              <div className="mt-1 text-[11px] sm:text-xs text-slate-300 font-medium">créneaux / semaine</div>
            </div>
            <div className="text-center border-r border-white/10 pr-2 sm:pr-4">
              <div className="font-display text-xl sm:text-3xl font-700 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">12</div>
              <div className="mt-1 text-[11px] sm:text-xs text-slate-300 font-medium">pays connectés</div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl sm:text-3xl font-700 text-pink-500 drop-shadow-[0_0_15px_rgba(255,0,80,0.6)]">1h30</div>
              <div className="mt-1 text-[11px] sm:text-xs text-slate-300 font-medium">par session pro</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
