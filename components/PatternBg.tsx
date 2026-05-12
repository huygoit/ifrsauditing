export function PatternBg({
  variant,
  className
}: {
  variant: "hero" | "pricing" | "testimonials";
  className?: string;
}) {
  const base = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

  const palette =
    variant === "hero"
      ? { a: "bg-emerald-100/50", b: "bg-slate-100/60" }
      : variant === "pricing"
        ? { a: "bg-emerald-100/40", b: "bg-slate-100/60" }
        : { a: "bg-emerald-100/35", b: "bg-slate-100/55" };

  return (
    <div className={[base, className ?? ""].join(" ")} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50" />
      <div className={["absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl", palette.a].join(" ")} />
      <div className={["absolute -bottom-28 -left-28 h-[520px] w-[520px] rounded-full blur-3xl", palette.b].join(" ")} />

      {/* ultra-subtle dotted grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 1200 600" preserveAspectRatio="none">
        <defs>
          <pattern id={`dots-${variant}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#10b981" />
          </pattern>
        </defs>
        <rect width="1200" height="600" fill={`url(#dots-${variant})`} />
      </svg>
    </div>
  );
}


