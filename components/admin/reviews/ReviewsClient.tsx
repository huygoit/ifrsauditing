"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { FileUploader } from "@/components/admin/FileUploader";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";
type Status = "PENDING" | "APPROVED" | "HIDDEN";

type Row = {
  id: string;
  rating: number;
  avatar: string | null;
  location: string | null;
  status: Status;
  createdAt: string;
  images: string[];
  translation: { lang: Lang; name: string; content: string };
  meta: { missingLang: boolean; suspicious: boolean };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${n} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn("text-sm", i < n ? "opacity-100" : "opacity-25")}>
          ★
        </span>
      ))}
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "emerald" | "slate" | "amber" | "rose" }) {
  const cls =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : tone === "rose"
          ? "border-rose-200 bg-rose-50 text-rose-800"
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

export function ReviewsClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("PENDING");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<Row | null>(null);

  // form
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Status>("PENDING");
  const [images, setImages] = useState(""); // comma separated
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [viFallback, setViFallback] = useState<{ name: string; content: string } | null>(null);
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
      const res = await fetch(`/api/admin/reviews?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setItems(json.items ?? []);
      setSelected({});
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
    setRating(5);
    setAvatar("");
    setLocation("");
    setStatus("PENDING");
    setImages("");
    setName("");
    setContent("");
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setRating(row?.rating ?? 5);
    setAvatar(row?.avatar ?? "");
    setLocation(row?.location ?? "");
    setStatus(row?.status ?? "PENDING");
    setImages((row?.images ?? []).join(", "));
    setName(row?.translation?.name ?? "");
    setContent(row?.translation?.content ?? "");
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const res = await fetch(`/api/admin/reviews/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const vi = (json?.item?.translations ?? []).find((t: any) => t.lang === "vi");
        setViFallback(vi ? { name: vi.name ?? "", content: vi.content ?? "" } : null);
      }
    } else setViFallback(null);
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const payload = {
        lang,
        rating,
        avatar: avatar.trim() ? avatar.trim() : null,
        location: location.trim() ? location.trim() : null,
        status,
        images: images.split(",").map((s) => s.trim()).filter(Boolean),
        name,
        content
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
          : await fetch(`/api/admin/reviews/${editing?.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("save_failed");
      setDrawerOpen(false);
      await load();
    } catch {
      setSaveError("Không lưu được. Thử lại.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function bulk(action: "approve" | "hide" | "set_pending") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/reviews/bulk", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids, action }) });
    await load();
  }

  async function quickStatus(id: string, next: Status) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, status: next }) });
    if (!res.ok) await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "admin.reviews.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.reviews.subtitle")} <span className="font-semibold">?lang</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button type="button" onClick={() => switchLang("vi")} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "vi" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}>VI</button>
              <button type="button" onClick={() => switchLang("en")} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "en" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}>EN</button>
            </div>
            <button type="button" onClick={openCreate} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">+ {tAdmin(lang as any, "common.add")}</button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.search")}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.reviews.search_placeholder")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.status")}</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "admin.reviews.status_all")}</option>
              <option value="PENDING">{tAdmin(lang as any, "admin.reviews.status_pending")}</option>
              <option value="APPROVED">{tAdmin(lang as any, "admin.reviews.status_approved")}</option>
              <option value="HIDDEN">{tAdmin(lang as any, "admin.reviews.status_hidden")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">{tAdmin(lang as any, "common.selected")}: {selectedIds.length}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => bulk("approve")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">{tAdmin(lang as any, "admin.reviews.bulk_approve")}</button>
              <button type="button" onClick={() => bulk("hide")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "admin.reviews.bulk_hide")}</button>
              <button type="button" onClick={() => bulk("set_pending")} className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100">{tAdmin(lang as any, "admin.reviews.bulk_pending")}</button>
              <button type="button" onClick={() => setSelected({})} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.clear")}</button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((row) => (
              <div key={row.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <input type="checkbox" checked={Boolean(selected[row.id])} onChange={(e) => setSelected((p) => ({ ...p, [row.id]: e.target.checked }))} />
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{row.translation.name || row.id}</p>
                    <Stars n={row.rating} />
                    <Pill>{tAdmin(lang as any, `admin.reviews.status_${row.status.toLowerCase()}` as any)}</Pill>
                    {row.meta.missingLang ? <Pill tone="amber">{tAdmin(lang as any, "admin.reviews.pill_missing_en")}</Pill> : null}
                    {row.meta.suspicious ? <Pill tone="rose">{tAdmin(lang as any, "admin.reviews.pill_suspicious")}</Pill> : null}
                    {row.location ? <Pill>{row.location}</Pill> : null}
                    <Pill>{new Date(row.createdAt).toLocaleDateString("vi-VN")}</Pill>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{row.translation.content}</p>
                  {row.images?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {row.images.slice(0, 4).map((src) => (
                        <img key={src} src={src} alt="img" className="h-12 w-12 rounded-xl border border-slate-200 object-cover" loading="lazy" />
                      ))}
                    </div>
                  ) : null}
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => quickStatus(row.id, "APPROVED")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">{tAdmin(lang as any, "admin.reviews.bulk_approve")}</button>
                  <button type="button" onClick={() => quickStatus(row.id, "HIDDEN")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "admin.reviews.bulk_hide")}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{tAdmin(lang as any, "admin.reviews.empty")}</div>
        )}
      </div>

      <QuickEditDrawer open={drawerOpen} title={mode === "create" ? tAdmin(lang as any, "admin.reviews.drawer_create") : editing?.translation?.name ? tAdmin(lang as any, "admin.reviews.drawer_edit_name").replace("{name}", editing.translation.name) : tAdmin(lang as any, "admin.reviews.drawer_edit")} subtitle={lang === "en" && viFallback ? `${tAdmin(lang as any, "admin.reviews.fallback_vi")}: ${viFallback.name}` : undefined} onClose={() => setDrawerOpen(false)}>
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.reviews.fallback_vi")}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.name}</p>
                <p className="mt-1 text-xs text-slate-600">{viFallback.content}</p>
              </div>
              <button type="button" onClick={() => { setName((x) => x || viFallback.name); setContent((x) => x || viFallback.content); }} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "admin.reviews.copy_vi_en")}</button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          <Field label={tAdmin(lang as any, "admin.reviews.form_name")}>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label={tAdmin(lang as any, "admin.reviews.form_content")}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.reviews.form_rating")}>
              <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
            </Field>
            <Field label={tAdmin(lang as any, "admin.reviews.form_status")}>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                <option value="PENDING">{tAdmin(lang as any, "admin.reviews.status_pending")}</option>
                <option value="APPROVED">{tAdmin(lang as any, "admin.reviews.status_approved")}</option>
                <option value="HIDDEN">{tAdmin(lang as any, "admin.reviews.status_hidden")}</option>
              </select>
            </Field>
          </div>

          <Field label={tAdmin(lang as any, "admin.reviews.form_avatar")} hint={tAdmin(lang as any, "admin.reviews.form_avatar_hint")}>
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder="/uploads/reviews/avatar.jpg" />
          </Field>
          <FileUploader folder="uploads/reviews" value={avatar} onChange={setAvatar} accept="image/*" />

          <Field label={tAdmin(lang as any, "admin.reviews.form_location")}>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.reviews.form_location_placeholder")} />
          </Field>
          <Field label={tAdmin(lang as any, "admin.reviews.form_images")} hint={tAdmin(lang as any, "admin.reviews.form_images_hint")}>
            <input value={images} onChange={(e) => setImages(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <FileUploader
            folder="uploads/reviews"
            multiple
            values={images.split(",").map((s) => s.trim()).filter(Boolean)}
            onChangeMany={(srcs) => setImages(srcs.join(", "))}
            accept="image/*"
          />

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.cancel")}</button>
            <button type="button" onClick={save} disabled={saveLoading || !name.trim() || !content.trim()} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">{saveLoading ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}</button>
          </div>
        </div>
      </QuickEditDrawer>
    </div>
  );
}


