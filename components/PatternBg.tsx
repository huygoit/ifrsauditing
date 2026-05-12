/**
 * Nền trang trí — độ mờ tối đa ~0.08 theo hướng dẫn thương hiệu.
 */
export function PatternBg({
  variant,
  className
}: {
  variant: "hero" | "heroDark" | "emerald" | "pricing" | "testimonials" | "subtleGrid";
  className?: string;
}) {
  const base = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

  /* Hero tối: z-0 trong section có isolate — tránh z âm chui xuống dưới nền trắng trang */
  if (variant === "heroDark") {
    const baseDark = "pointer-events-none absolute inset-0 z-0 overflow-hidden";
    return (
      <div className={[baseDark, className ?? ""].join(" ")} aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950" />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: `radial-gradient(circle at 18% 18%, rgb(16 185 129 / 0.28), transparent 42%),
              radial-gradient(circle at 82% 58%, rgb(6 78 59 / 0.32), transparent 38%)`
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.045]" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <defs>
            <pattern id="dots-hero-dark" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#a7f3d0" />
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#dots-hero-dark)" />
        </svg>
        <div
          className="absolute inset-0 opacity-[0.038]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
      </div>
    );
  }

  if (variant === "emerald" || variant === "subtleGrid") {
    return (
      <div className={[base, className ?? ""].join(" ")} aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(15 118 110 / 0.1) 1px, transparent 1px), linear-gradient(90deg, rgb(15 118 110 / 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>
    );
  }

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
