"use client";

import { useEffect, useMemo, useState } from "react";
import { tAdmin } from "@/lib/admin/i18n";
import { FaqDrawer } from "@/components/admin/faq/FaqDrawer";
import type { FaqFormValue, FaqStatus } from "@/components/admin/faq/FaqForm";
import { listFaqs, getFaq, createFaq, updateFaq, deleteFaq, bulkFaq, reorderFaqs } from "@/lib/admin/faq";

type Lang = "vi" | "en";

export type FaqRow = {
  id: number;
  status: FaqStatus;
  sortOrder: number;
  sectionKey: string | null;
  createdAt: string;
  updatedAt: string;
  translation: { lang: Lang; question: string; answer: string };
  meta: { missingLang: boolean; hasVi: boolean };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function StatusPill({ status, label }: { status: FaqStatus; label: string }) {
  const cls =
    status === "VISIBLE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>{label}</span>;
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="h-5 w-5 rounded bg-slate-100" />
      <div className="min-w-0">
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="h-7 w-24 rounded-full bg-slate-100" />
    </div>
  );
}

export function FaqTable({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | FaqStatus>("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FaqRow[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => Number(k)), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<FaqFormValue>({
    question: "",
    answer: "",
    sectionKey: "",
    status: "VISIBLE",
    sortOrder: 0
  });
  const [viFallback, setViFallback] = useState<{ question: string; answer: string } | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const l = sp.get("lang");
    setLang(l === "en" ? "en" : "vi");
  }, []);

  function switchLang(next: Lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.location.href = url.toString();
  }

  async function load() {
    setLoading(true);
    try {
      const res = await listFaqs({
        lang,
        q: q.trim() ? q.trim() : undefined,
        status: statusFilter || undefined,
        sectionKey: sectionFilter.trim() ? sectionFilter.trim() : undefined
      });
      setItems(Array.isArray((res as any)?.items) ? ((res as any).items as any) : []);
      setSelected({});
    } catch {
      setItems([]);
      setSelected({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, statusFilter, sectionFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditingId(null);
    setForm({ question: "", answer: "", sectionKey: "", status: "VISIBLE", sortOrder: 0 });
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: number) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditingId(id);
    setForm({
      question: row?.translation.question ?? "",
      answer: row?.translation.answer ?? "",
      sectionKey: row?.sectionKey ?? "",
      status: row?.status ?? "VISIBLE",
      sortOrder: row?.sortOrder ?? 0
    });
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const detail = await getFaq(id);
      const vi = (detail.item?.translations ?? []).find((t: any) => t.lang === "vi");
      setViFallback(vi ? { question: vi.question ?? "", answer: vi.answer ?? "" } : null);
    } else {
      setViFallback(null);
    }
  }

  async function onSave() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      if (mode === "create") {
        await createFaq({
          lang,
          question: form.question,
          answer: form.answer,
          sectionKey: form.sectionKey.trim() ? form.sectionKey.trim() : null,
          status: form.status,
          sortOrder: form.sortOrder
        });
      } else if (editingId != null) {
        await updateFaq(editingId, {
          lang,
          question: form.question,
          answer: form.answer,
          sectionKey: form.sectionKey.trim() ? form.sectionKey.trim() : null,
          status: form.status,
          sortOrder: form.sortOrder
        });
      }
      setDrawerOpen(false);
      await load();
    } catch {
      setSaveError(tAdmin(lang as any, "admin.common.save_error"));
    } finally {
      setSaveLoading(false);
    }
  }

  async function toggleStatus(id: number, next: FaqStatus) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const res = await updateFaq(id, { lang, status: next });
    if (!res.ok) await load();
  }

  async function onDuplicate(id: number) {
    const detail = await getFaq(id);
    const tr = (detail.item?.translations ?? []).find((t: any) => t.lang === lang) ?? null;
    const base = detail.item ?? null;
    if (!base || !tr) return;
    await createFaq({
      lang,
      question: tr.question,
      answer: tr.answer,
      sectionKey: base.sectionKey ?? null,
      status: base.status ?? "VISIBLE",
      sortOrder: (base.sortOrder ?? 0) + 5
    });
    await load();
  }

  async function onDelete(id: number) {
    if (!window.confirm(tAdmin(lang as any, "admin.faq.confirm_delete"))) return;
    await deleteFaq(id);
    await load();
  }

  async function onBulk(action: "set_visible" | "set_hidden" | "delete") {
    if (!selectedIds.length) return;
    if (action === "delete") {
      if (!window.confirm(tAdmin(lang as any, "admin.faq.confirm_bulk_delete"))) return;
    }
    await bulkFaq({ ids: selectedIds, action });
    await load();
  }

  async function move(id: number, dir: "up" | "down") {
    const idx = items.findIndex((x) => x.id === id);
    if (idx < 0) return;
    const next = [...items];
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    setItems(next);
    await reorderFaqs({ ids: next.map((x) => x.id) });
    await load();
  }

  const sectionOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((x) => {
      if (x.sectionKey?.trim()) set.add(x.sectionKey.trim());
    });
    return Array.from(set).sort();
  }, [items]);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "admin.faq.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{tAdmin(lang as any, "admin.faq.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => switchLang("vi")}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "vi" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "en" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {tAdmin(lang as any, "common.add")}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tAdmin(lang as any, "admin.faq.search_placeholder")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter((e.target.value as any) || "")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <option value="">{tAdmin(lang as any, "common.all")}</option>
            <option value="VISIBLE">{tAdmin(lang as any, "admin.faq.status_visible")}</option>
            <option value="HIDDEN">{tAdmin(lang as any, "admin.faq.status_hidden")}</option>
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <option value="">{tAdmin(lang as any, "admin.faq.section_all")}</option>
            {sectionOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {tAdmin(lang as any, "common.selected")}: {selectedIds.length}
          </span>
          <button
            type="button"
            onClick={() => onBulk("set_visible")}
            disabled={!selectedIds.length}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            {tAdmin(lang as any, "admin.faq.bulk_set_visible")}
          </button>
          <button
            type="button"
            onClick={() => onBulk("set_hidden")}
            disabled={!selectedIds.length}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            {tAdmin(lang as any, "admin.faq.bulk_set_hidden")}
          </button>
          <button
            type="button"
            onClick={() => onBulk("delete")}
            disabled={!selectedIds.length}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 shadow-sm transition hover:bg-rose-100 disabled:opacity-50"
          >
            {tAdmin(lang as any, "admin.faq.bulk_delete")}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="grid gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-2">
            {items.map((row) => {
              const checked = Boolean(selected[String(row.id)]);
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setSelected((prev) => ({ ...prev, [String(row.id)]: e.target.checked }))}
                    className="h-4 w-4 accent-emerald-600"
                    aria-label="Select"
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => move(row.id, "up")}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        aria-label={tAdmin(lang as any, "admin.common.move_up")}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(row.id, "down")}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        aria-label={tAdmin(lang as any, "admin.common.move_down")}
                      >
                        ↓
                      </button>
                      <span className="text-xs font-semibold text-slate-500">#{row.sortOrder}</span>
                      {row.sectionKey ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          {row.sectionKey}
                        </span>
                      ) : null}
                      {lang === "en" && row.meta.missingLang ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
                          {tAdmin(lang as any, "admin.faq.fallback_vi")}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">{row.translation.question || "—"}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">{new Date(row.updatedAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2 justify-self-end">
                    <button
                      type="button"
                      onClick={() => toggleStatus(row.id, row.status === "VISIBLE" ? "HIDDEN" : "VISIBLE")}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      aria-label={tAdmin(lang as any, "admin.common.toggle_status")}
                    >
                      <StatusPill status={row.status} label={tAdmin(lang as any, row.status === "VISIBLE" ? "admin.faq.status_visible" : "admin.faq.status_hidden")} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEdit(row.id)}
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      {tAdmin(lang as any, "common.edit")}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicate(row.id)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      {tAdmin(lang as any, "admin.faq.duplicate")}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800 shadow-sm transition hover:bg-rose-100"
                    >
                      {tAdmin(lang as any, "admin.faq.delete")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{tAdmin(lang as any, "admin.faq.empty")}</div>
        )}
      </div>

      <FaqDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        lang={lang}
        mode={mode}
        saving={saveLoading}
        error={saveError}
        onSave={onSave}
        value={form}
        onChange={setForm}
        viFallback={viFallback}
        onCopyViToEn={() => {
          if (!viFallback) return;
          setForm((prev) => ({ ...prev, question: viFallback.question, answer: viFallback.answer }));
        }}
      />
    </div>
  );
}

