"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { tAdmin } from "@/lib/admin/i18n";
import { slugifyAscii } from "@/lib/slug";
import { SITE_CONTENT_TYPES, SITE_CONTENT_TYPE_LABELS, DEFAULT_SITE_CONTENT_TYPE, type SiteContentType } from "@/lib/siteContentTypes";

type Lang = "vi" | "en";

type Row = {
  id: string;
  parentId: string | null;
  type: SiteContentType;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  translation: { lang: Lang; name: string; slug: string; description: string; seoTitle?: string; seoDesc?: string };
  meta: { missingLang: boolean; hasVi: boolean };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function StatusPill({ status }: { status: Row["status"] }) {
  const cls =
    status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>{status}</span>;
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="h-5 w-5 rounded bg-slate-100" />
      <div className="min-w-0">
        <div className="h-4 w-1/2 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="h-7 w-24 rounded-full bg-slate-100" />
    </div>
  );
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

export function SiteContentCategoriesClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVE" | "INACTIVE">("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  // Map id -> tên để hiển thị nhãn danh mục cha
  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const it of items) m.set(it.id, it.translation.name || `/${it.translation.slug}`);
    return m;
  }, [items]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("edit");

  // form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [parentId, setParentId] = useState("");
  const [type, setType] = useState<SiteContentType>(DEFAULT_SITE_CONTENT_TYPE);
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [baseStatus, setBaseStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [viFallback, setViFallback] = useState<{ name: string; slug: string; description: string; seoTitle: string; seoDesc: string } | null>(null);

  // Danh mục đang sửa có con thì không cho gán cha (giữ phân cấp 2 tầng)
  const editingHasChildren = useMemo(
    () => (editing ? items.some((x) => x.parentId === editing.id) : false),
    [items, editing]
  );

  // Chỉ danh mục cấp 1 (không có cha) mới được làm cha, và không phải chính nó
  const parentOptions = useMemo(
    () => items.filter((x) => !x.parentId && x.id !== editing?.id),
    [items, editing]
  );

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
      const res = await fetch(`/api/admin/site-content-categories?${sp.toString()}`, { cache: "no-store" });
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
    const t = window.setTimeout(() => load(), 200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setName("");
    setSlug("");
    setSlugTouched(false);
    setParentId("");
    setType(DEFAULT_SITE_CONTENT_TYPE);
    setDescription("");
    setSeoTitle("");
    setSeoDesc("");
    setBaseStatus("ACTIVE");
    setSortOrder("");
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setName(row?.translation?.name ?? "");
    setSlug(row?.translation?.slug ?? "");
    setSlugTouched(true);
    setParentId(row?.parentId ?? "");
    setType(row?.type ?? DEFAULT_SITE_CONTENT_TYPE);
    setDescription(row?.translation?.description ?? "");
    setSeoTitle(String((row as any)?.translation?.seoTitle ?? ""));
    setSeoDesc(String((row as any)?.translation?.seoDesc ?? ""));
    setBaseStatus(row?.status ?? "ACTIVE");
    setSortOrder(row?.sortOrder ?? "");
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const res = await fetch(`/api/admin/site-content-categories/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const vi = (json?.item?.translations ?? []).find((t: any) => t.lang === "vi");
        setViFallback(
          vi
            ? {
                name: vi.name ?? "",
                slug: vi.slug ?? "",
                description: vi.description ?? "",
                seoTitle: vi.seoTitle ?? "",
                seoDesc: vi.seoDesc ?? ""
              }
            : null
        );
      }
    } else {
      setViFallback(null);
    }
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const payload: any = {
        lang,
        status: baseStatus,
        parentId: parentId.trim() ? parentId.trim() : null,
        type,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        name: name.trim(),
        slug: slugifyAscii(slug.trim() || name.trim()),
        description,
        seoTitle,
        seoDesc
      };

      const url = mode === "create" ? "/api/admin/site-content-categories" : `/api/admin/site-content-categories/${editing?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      let res: Response | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
        if (res.status !== 409) break;
        const j = await res.json().catch(() => ({} as any));
        const suggestion = typeof j?.suggestion === "string" ? j.suggestion : "";
        if (!suggestion || suggestion === payload.slug) break;
        payload.slug = suggestion;
        setSlug(suggestion);
      }

      if (!res || !res.ok) throw new Error(res?.status === 409 ? "slug_conflict" : "save_failed");
      setDrawerOpen(false);
      await load();
    } catch {
      setSaveError(tAdmin(lang as any, "admin.common.save_error"));
    } finally {
      setSaveLoading(false);
    }
  }

  async function toggleStatus(id: string, next: Row["status"]) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const res = await fetch(`/api/admin/site-content-categories/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang, status: next })
    });
    if (!res.ok) await load();
  }

  async function bulk(action: "set_status_active" | "set_status_inactive") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/site-content-categories/bulk", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids, action })
    });
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
    await fetch("/api/admin/site-content-categories/reorder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: next.map((x) => x.id) })
    });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "admin.site_content_categories.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.site_content_categories.subtitle")} <span className="font-semibold">?lang</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => switchLang("vi")}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "vi" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}
                aria-label={tAdmin(lang as any, "admin.common.edit_vi")}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "en" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}
                aria-label={tAdmin(lang as any, "admin.common.edit_en")}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + {tAdmin(lang as any, "common.add")}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px] sm:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.search")}</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder={tAdmin(lang as any, "admin.site_content_categories.search_placeholder")}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.status")}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">
              {tAdmin(lang as any, "common.selected")}: {selectedIds.length}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => bulk("set_status_active")}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                {tAdmin(lang as any, "admin.site_content_categories.bulk_set_active")}
              </button>
              <button
                type="button"
                onClick={() => bulk("set_status_inactive")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "admin.site_content_categories.bulk_set_inactive")}
              </button>
              <button
                type="button"
                onClick={() => setSelected({})}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "common.clear")}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : items.length ? (
            items.map((row, idx) => {
              const checked = Boolean(selected[row.id]);
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setSelected((p) => ({ ...p, [row.id]: e.target.checked }))}
                    aria-label={`${tAdmin(lang as any, "admin.site_content_categories.select")} ${row.translation.name || row.id}`}
                  />

                  <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                    <div className="flex flex-wrap items-center gap-2">
                      {row.parentId ? <span className="text-slate-400" aria-hidden="true">↳</span> : null}
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {row.translation.name || <span className="text-slate-400">{tAdmin(lang as any, "common.none")}</span>}
                      </p>
                      {row.parentId ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                          {tAdmin(lang as any, "admin.site_content_categories.child_of")} {nameById.get(row.parentId) ?? "—"}
                        </span>
                      ) : null}
                      {row.meta.missingLang ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                          {tAdmin(lang as any, "admin.common.missing_en")}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        /{row.translation.slug}
                      </span>
                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
                        {SITE_CONTENT_TYPE_LABELS[row.type]?.[lang] ?? row.type}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-600">{row.translation.description}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {tAdmin(lang as any, "admin.common.sort_prefix")} <span className="font-semibold text-slate-700">{row.sortOrder}</span>
                    </p>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => move(row.id, "up")}
                      disabled={idx === 0}
                      aria-label={tAdmin(lang as any, "admin.common.move_up")}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => move(row.id, "down")}
                      disabled={idx === items.length - 1}
                      aria-label={tAdmin(lang as any, "admin.common.move_down")}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(row.id, row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      aria-label={tAdmin(lang as any, "admin.common.toggle_status")}
                    >
                      <StatusPill status={row.status} />
                      <span className="text-slate-400">↔</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              {tAdmin(lang as any, "admin.site_content_categories.empty")}
            </div>
          )}
        </div>
      </div>

      <QuickEditDrawer
        open={drawerOpen}
        title={
          mode === "create"
            ? tAdmin(lang as any, "admin.site_content_categories.create_title")
            : editing?.translation?.name
              ? `${tAdmin(lang as any, "common.edit")}: ${editing.translation.name}`
              : tAdmin(lang as any, "admin.site_content_categories.edit_title")
        }
        subtitle={lang === "en" && viFallback ? `${tAdmin(lang as any, "admin.common.fallback_vi_prefix")} ${viFallback.name}` : undefined}
        onClose={() => setDrawerOpen(false)}
      >
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.common.fallback_vi_label")}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.name}</p>
                <p className="mt-1 text-xs text-slate-600">/{viFallback.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setName((x) => x || viFallback.name);
                  setSlug((x) => x || viFallback.slug);
                  setDescription((x) => x || viFallback.description);
                  setSeoTitle((x) => x || viFallback.seoTitle);
                  setSeoDesc((x) => x || viFallback.seoDesc);
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "admin.common.copy_vi_to_en")}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          <Field label={tAdmin(lang as any, "admin.site_content_categories.form.name")}>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugifyAscii(e.target.value));
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <Field label={tAdmin(lang as any, "admin.site_content_categories.form.slug")} hint={tAdmin(lang as any, "admin.site_content_categories.form.slug_hint")}>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugifyAscii(e.target.value));
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder={tAdmin(lang as any, "admin.site_content_categories.form.slug_placeholder")}
            />
          </Field>
          <Field
            label={tAdmin(lang as any, "admin.site_content_categories.form.type")}
            hint={tAdmin(lang as any, "admin.site_content_categories.form.type_hint")}
          >
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SiteContentType)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {SITE_CONTENT_TYPES.map((tp) => (
                <option key={tp} value={tp}>
                  {SITE_CONTENT_TYPE_LABELS[tp][lang]}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={tAdmin(lang as any, "admin.site_content_categories.form.parent")}
            hint={
              editingHasChildren
                ? tAdmin(lang as any, "admin.site_content_categories.form.parent_locked")
                : tAdmin(lang as any, "admin.site_content_categories.form.parent_hint")
            }
          >
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              disabled={editingHasChildren}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">{tAdmin(lang as any, "admin.site_content_categories.form.parent_none")}</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.translation.name || `/${opt.translation.slug}`}
                </option>
              ))}
            </select>
          </Field>
          <Field label={tAdmin(lang as any, "admin.site_content_categories.form.description")}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.site_content_categories.form.seo_title")}>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
            <Field label={tAdmin(lang as any, "admin.site_content_categories.form.seo_desc")}>
              <textarea
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.site_content_categories.form.sort_order")}>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
            <Field label={tAdmin(lang as any, "common.status")}>
              <select
                value={baseStatus}
                onChange={(e) => setBaseStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </Field>
          </div>

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              {tAdmin(lang as any, "common.cancel")}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saveLoading || !name.trim()}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {saveLoading ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}
            </button>
          </div>
        </div>
      </QuickEditDrawer>
    </div>
  );
}

