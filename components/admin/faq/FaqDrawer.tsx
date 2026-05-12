"use client";

import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { tAdmin } from "@/lib/admin/i18n";
import { FaqForm, type FaqFormValue } from "./FaqForm";

type Lang = "vi" | "en";

export function FaqDrawer({
  open,
  onClose,
  lang,
  mode,
  saving,
  error,
  onSave,
  value,
  onChange,
  viFallback,
  onCopyViToEn
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  mode: "create" | "edit";
  saving: boolean;
  error: string | null;
  onSave: () => void;
  value: FaqFormValue;
  onChange: (next: FaqFormValue) => void;
  viFallback: { question: string; answer: string } | null;
  onCopyViToEn: () => void;
}) {
  const title = mode === "create" ? tAdmin(lang as any, "admin.faq.create_title") : tAdmin(lang as any, "admin.faq.edit_title");

  return (
    <QuickEditDrawer
      open={open}
      onClose={onClose}
      title={title}
    >
      <div className="grid gap-5">
        <FaqForm
          lang={lang}
          value={value}
          onChange={onChange}
          viFallback={viFallback}
          onCopyViToEn={onCopyViToEn}
          showFallback={mode === "edit"}
        />

        <div className="sticky bottom-0 -mx-5 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : <div />}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "common.cancel")}
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </QuickEditDrawer>
  );
}

