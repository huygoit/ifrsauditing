"use client";

import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "sm" | "md";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 hover:shadow-md focus-visible:ring-offset-white",
  secondary:
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 hover:shadow-md focus-visible:ring-offset-white",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-50 focus-visible:ring-offset-white",
  onDark:
    "border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur-sm hover:bg-white/15 hover:shadow-md focus-visible:ring-offset-slate-950"
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm"
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={cx(base, variants[variant], sizes[size], className)} />;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size }) {
  return <a {...props} className={cx(base, variants[variant], sizes[size], className)} />;
}


