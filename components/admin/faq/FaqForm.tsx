"use client";

import { useMemo } from "react";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";

export type FaqStatus = "VISIBLE" | "HIDDEN";

export type FaqFormValue = {
  question: string;
  answer: string;
  sectionKey: string;
  status: FaqStatus;
  sortOrder: number;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function FaqForm({
  lang,
  value,
  onChange,
  viFallback,
  onCopyViToEn,
  showFallback
}: {
  lang: Lang;
  value: FaqFormValue;
  onChange: (next: FaqFormValue) => void;
  viFallback: { question: string; answer: string } | null;
  onCopyViToEn: () => void;
  showFallback: boolean;
}) {
  const sectionOptions = useMemo(
    () => [
      { value: "", label: tAdmin(lang as any, "admin.faq.section_all") },
      { value: "shipping", label: "shipping" },
      { value: "usage", label: "usage" },
      { value: "returns", label: "returns" },
      { value: "product", label: "product" }
    ],
    [lang]
  );

  return (
    <div className="grid gap-4">
      {showFallback && lang === "en" && viFallback ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">{tAdmin(lang as any, "admin.faq.fallback_vi")}</p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{viFallback.question}</p>
            </div>
            <button
              type="button"
              onClick={onCopyViToEn}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {tAdmin(lang as any, "admin.faq.copy_vi_to_en")}
            </button>
          </div>
          <p className="mt-2 line-clamp-4 text-sm text-slate-700">{viFallback.answer}</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={tAdmin(lang as any, "common.status")}>
          <select
            value={value.status}
            onChange={(e) => onChange({ ...value, status: e.target.value as FaqStatus })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <option value="VISIBLE">{tAdmin(lang as any, "admin.faq.status_visible")}</option>
            <option value="HIDDEN">{tAdmin(lang as any, "admin.faq.status_hidden")}</option>
          </select>
        </Field>

        <Field label={tAdmin(lang as any, "admin.common.sort_order_optional")}>
          <input
            type="number"
            value={Number.isFinite(value.sortOrder) ? value.sortOrder : 0}
            onChange={(e) => onChange({ ...value, sortOrder: Number(e.target.value) })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            min={0}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={tAdmin(lang as any, "admin.faq.section")} hint={tAdmin(lang as any, "admin.faq.section_key_hint")}>
          <div className="grid gap-2">
            <select
              value={sectionOptions.some((o) => o.value === value.sectionKey) ? value.sectionKey : ""}
              onChange={(e) => {
                const next = e.target.value;
                onChange({ ...value, sectionKey: next });
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {sectionOptions.map((o) => (
                <option key={o.value || "__all"} value={o.value}>
                  {o.label}
                </option>
              ))}
              <option value="__custom">custom…</option>
            </select>

            {sectionOptions.some((o) => o.value === value.sectionKey) || value.sectionKey === "" ? null : (
              <input
                value={value.sectionKey}
                onChange={(e) => onChange({ ...value, sectionKey: e.target.value })}
                placeholder={tAdmin(lang as any, "admin.faq.section_custom_placeholder")}
                className={cn(
                  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm",
                  "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                )}
              />
            )}
          </div>
        </Field>

        <div />
      </div>

      <Field label={tAdmin(lang as any, "admin.faq.question")}>
        <input
          value={value.question}
          onChange={(e) => onChange({ ...value, question: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          placeholder="…"
        />
      </Field>

      <Field label={tAdmin(lang as any, "admin.faq.answer")}>
        <textarea
          value={value.answer}
          onChange={(e) => onChange({ ...value, answer: e.target.value })}
          rows={10}
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          placeholder="…"
        />
        <span className="text-xs text-slate-500">{tAdmin(lang as any, "admin.faq.answer_markdown_hint")}</span>
      </Field>
    </div>
  );
}

