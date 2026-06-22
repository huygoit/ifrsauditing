"use client";

import { useEffect, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { FileUploader } from "@/components/admin/FileUploader";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";
type Status = "PUBLISHED" | "HIDDEN";

type Row = {
  id: string;
  image: string;
  link: string | null;
  status: Status;
  sortOrder: number;
  translation: { lang: Lang; eyebrow: string; title: string; desc: string; alt: string };
  meta: { missingLang: boolean };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "emerald" | "slate" | "amber" }) {
  const cls =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>{children}</span>;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function SlidesClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<Row | null>(null);

  // form
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<Status>("PUBLISHED");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [alt, setAlt] = useState("");
  const [viFallback, setViFallback] = useState<{ eyebrow: string; title: string; desc: string; alt: string } | null>(null);
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
      const sp = new URLSearchParams();
      sp.set("lang", lang);
      if (q.trim()) sp.set("q", q.trim());
      if (statusFilter) sp.set("status", statusFilter);
      const res = await fetch(`/api/admin/slides?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setItems(json.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, statusFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setImage("");
    setLink("");
    setStatus("PUBLISHED");
    setSortOrder("");
    setEyebrow("");
    setTitle("");
    setDesc("");
    setAlt("");
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setImage(row?.image ?? "");
    setLink(row?.link ?? "");
    setStatus(row?.status ?? "PUBLISHED");
    setSortOrder(row?.sortOrder ?? "");
    setEyebrow(row?.translation?.eyebrow ?? "");
    setTitle(row?.translation?.title ?? "");
    setDesc(row?.translation?.desc ?? "");
    setAlt(row?.translation?.alt ?? "");
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const res = await fetch(`/api/admin/slides/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const vi = (json?.item?.translations ?? []).find((t: any) => t.lang === "vi");
        setViFallback(
          vi ? { eyebrow: vi.eyebrow ?? "", title: vi.title ?? "", desc: vi.desc ?? "", alt: vi.alt ?? "" } : null
        );
      }
    } else setViFallback(null);
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const payload = {
        lang,
        image,
        link: link.trim() ? link.trim() : null,
        status,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        eyebrow,
        title,
        desc,
        alt
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/slides", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
          : await fetch(`/api/admin/slides/${editing?.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("save_failed");
      setDrawerOpen(false);
      await load();
    } catch {
      setSaveError(tAdmin(lang as any, "admin.common.save_error"));
    } finally {
      setSaveLoading(false);
    }
  }

  async function toggleStatus(id: string, next: Status) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const res = await fetch(`/api/admin/slides/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, status: next }) });
    if (!res.ok) await load();
  }

  async function remove(id: string) {
    if (!window.confirm(tAdmin(lang as any, "admin.slides.confirm_delete"))) return;
    await fetch(`/api/admin/slides/${id}`, { method: "DELETE" });
    await load();
  }

  async function move(id: string, dir: "up" | "down") {
    const idx = items.findIndex((x) => x.id === id);
    if (idx < 0) return;
    const next = [...items];
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    setItems(next);
    await fetch("/api/admin/slides/reorder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "admin.slides.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{tAdmin(lang as any, "admin.slides.subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button type="button" onClick={() => switchLang("vi")} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "vi" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}>VI</button>
              <button type="button" onClick={() => switchLang("en")} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "en" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}>EN</button>
            </div>
            <button type="button" onClick={openCreate} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
              + {tAdmin(lang as any, "common.add")}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3 md:items-end">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.search")}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.slides.search_placeholder")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.status")}</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="grid gap-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((row, idx) => (
              <div key={row.id} className="grid grid-cols-[88px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.image} alt={row.translation.alt || row.translation.title} className="h-14 w-20 object-cover" />
                </div>
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{row.translation.title || row.id}</p>
                    {row.status === "PUBLISHED" ? <Pill tone="emerald">PUBLISHED</Pill> : <Pill>HIDDEN</Pill>}
                    {row.meta.missingLang ? <Pill tone="amber">EN thiếu</Pill> : null}
                    <Pill>sort: {row.sortOrder}</Pill>
                  </div>
                  {row.translation.eyebrow ? <p className="mt-1 truncate text-xs font-medium text-emerald-700">{row.translation.eyebrow}</p> : null}
                  {row.translation.desc ? <p className="mt-1 truncate text-xs text-slate-600">{row.translation.desc}</p> : null}
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "up")} disabled={idx === 0} aria-label="Move up">↑</button>
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "down")} disabled={idx === items.length - 1} aria-label="Move down">↓</button>
                  <button type="button" onClick={() => toggleStatus(row.id, row.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                    {row.status === "PUBLISHED" ? tAdmin(lang as any, "common.hide") : tAdmin(lang as any, "common.publish")}
                  </button>
                  <button type="button" onClick={() => remove(row.id)} className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50">
                    {tAdmin(lang as any, "admin.slides.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{tAdmin(lang as any, "admin.slides.empty")}</div>
        )}
      </div>

      <QuickEditDrawer
        open={drawerOpen}
        title={mode === "create" ? tAdmin(lang as any, "admin.slides.create_title") : editing?.translation?.title ? `${tAdmin(lang as any, "common.edit")}: ${editing.translation.title}` : tAdmin(lang as any, "admin.slides.edit_title")}
        subtitle={lang === "en" && viFallback ? `Fallback VI: ${viFallback.title}` : undefined}
        onClose={() => setDrawerOpen(false)}
      >
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.common.fallback_vi_label")}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.title}</p>
                <p className="mt-1 text-xs text-slate-600">{viFallback.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEyebrow((x) => x || viFallback.eyebrow);
                  setTitle((x) => x || viFallback.title);
                  setDesc((x) => x || viFallback.desc);
                  setAlt((x) => x || viFallback.alt);
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "admin.common.copy_vi_to_en")}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          <Field label={tAdmin(lang as any, "admin.slides.form.eyebrow")}>
            <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label={tAdmin(lang as any, "admin.slides.form.title")}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label={tAdmin(lang as any, "admin.slides.form.desc")}>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label={tAdmin(lang as any, "admin.slides.form.alt")} hint={tAdmin(lang as any, "admin.slides.form.alt_hint")}>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          <Field label={tAdmin(lang as any, "admin.slides.form.image")} hint="VD: /slides/img01.jpg hoặc /uploads/xxx.jpg">
            <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <FileUploader folder="uploads/slides" value={image} onChange={setImage} accept="image/*" />

          <Field label={tAdmin(lang as any, "admin.slides.form.link")}>
            <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder="https://… (tuỳ chọn)" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "common.status")}>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="HIDDEN">HIDDEN</option>
              </select>
            </Field>
            <Field label={tAdmin(lang as any, "admin.common.sort_order_optional")}>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
            </Field>
          </div>

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.cancel")}</button>
            <button type="button" onClick={save} disabled={saveLoading || !title.trim() || !image.trim()} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">{saveLoading ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}</button>
          </div>
        </div>
      </QuickEditDrawer>
    </div>
  );
}
