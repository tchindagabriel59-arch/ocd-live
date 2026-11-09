export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";
  return (
    <span className={`font-display font-800 tracking-tight ${s}`}>
      <span className="text-grad">OCD</span>{" "}
      <span className="relative inline-flex items-center gap-1.5">
        <span className="live-dot" />
        <span className="text-white">Live</span>
      </span>
    </span>
  );
}

export default Logo;
