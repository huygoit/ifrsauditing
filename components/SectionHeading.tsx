"use client";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  dark = false
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  const wrap = align === "center" ? "text-center mx-auto" : "";
  const subCls = dark ? "text-slate-300" : "text-slate-600";
  const titleCls = dark ? "text-white" : "text-slate-900";
  const eyebrowCls = dark ? "text-amber-400/90" : "text-emerald-600";

  return (
    <div className={["max-w-3xl", wrap].filter(Boolean).join(" ")}>
      {eyebrow ? (
        <p className={["text-xs font-semibold uppercase tracking-wider", eyebrowCls].join(" ")}>{eyebrow}</p>
      ) : null}
      <h2 className={["mt-2 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl", titleCls].join(" ")}>{title}</h2>
      {subtitle ? <p className={["mt-3 text-base leading-7", subCls].join(" ")}>{subtitle}</p> : null}
    </div>
  );
}
