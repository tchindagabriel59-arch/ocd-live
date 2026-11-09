/**
 * Logotype OCD Live — pièce maîtresse de l'identité.
 * Lockup typographique : "OCD" display + badge LIVE magenta à point pulsant.
 * Entièrement en em → se scale via text-* sans casser les proportions.
 */
export function Logo({
  size = "md",
  className = "",
  pulse = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  pulse?: boolean;
}) {
  const sizes = {
    sm: "text-[15px]",
    md: "text-[19px]",
    lg: "text-2xl",
    xl: "text-4xl sm:text-5xl",
  } as const;

  return (
    <span
      className={`font-display inline-flex select-none items-baseline gap-[0.4em] font-extrabold tracking-tight ${sizes[size]} ${className}`}
    >
      <span className="text-white drop-shadow-[0_2px_14px_rgba(0,242,254,0.25)]">
        OCD
      </span>
      <span className="from-live to-mag inline-flex items-center gap-[0.35em] rounded-[0.38em] bg-gradient-to-r px-[0.5em] py-[0.24em] align-baseline text-[0.66em] leading-none font-bold tracking-[0.08em] text-white shadow-[0_10px_28px_-10px_rgba(255,0,80,0.75)] ring-1 ring-white/20 ring-inset">
        {pulse && (
          <span className="live-dot" style={{ width: "0.5em", height: "0.5em" }} />
        )}
        LIVE
      </span>
    </span>
  );
}
