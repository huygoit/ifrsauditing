"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { FileUploader } from "@/components/admin/FileUploader";
import { NewsEditor } from "@/components/admin/news/NewsEditor";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";

type CategoryOption = { id: string; name: string; missingLang?: boolean };

type ProductRow = {
  id: string;
  categoryId: string;
  categoryName: string;
  priceVnd: number;
  salePriceVnd: number | null;
  sizeTag: string;
  badges: string[];
  status: "ACTIVE" | "INACTIVE";
  featured: boolean;
  sortOrder: number;
  thumbnailSrc: string;
  translation: { lang: Lang; name: string; shortDesc: string };
  meta: { missingLang: boolean };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function fmtVnd(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
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

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[28px_56px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="h-5 w-5 rounded bg-slate-100" />
      <div className="h-12 w-14 rounded-xl bg-slate-100" />
      <div className="min-w-0">
        <div className="h-4 w-1/2 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="h-7 w-40 rounded-full bg-slate-100" />
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

export function ProductsClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVE" | "INACTIVE">("");
  const [featuredFilter, setFeaturedFilter] = useState<"" | "true" | "false">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ProductRow[]>([]);
  const [cats, setCats] = useState<CategoryOption[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("edit");

  // form state
  const [id, setId] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [priceVnd, setPriceVnd] = useState<number>(69000);
  const [salePriceVnd, setSalePriceVnd] = useState<number | "">("");
  const [sizeTag, setSizeTag] = useState("Gói 50g");
  const [badges, setBadges] = useState("Best seller");
  const [baseStatus, setBaseStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [thumbnailSrc, setThumbnailSrc] = useState("/products/product-01.jpg");

  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [descriptionJson, setDescriptionJson] = useState<any | null>(null);
  const [descriptionMarkdown, setDescriptionMarkdown] = useState("");
  const [viFallback, setViFallback] = useState<{
    name: string;
    shortDesc: string;
    descriptionJson?: any;
    descriptionMarkdown?: string;
  } | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const editorSnapshotRef = useRef<null | (() => { json: any; html: string })>(null);
  const [editorKey, setEditorKey] = useState(() => `init:${Date.now()}`);

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

  async function loadCategories() {
    const res = await fetch(`/api/admin/categories?lang=${lang}`, { cache: "no-store" });
    const json = await res.json();
    const list = (json.items ?? []).map((c: any) => ({
      id: c.id,
      name: c.translation?.name || c.id,
      missingLang: Boolean(c.meta?.missingLang)
    }));
    setCats(list);
    if (!formCategoryId && list[0]?.id) setFormCategoryId(list[0].id);
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      sp.set("lang", lang);
      if (q.trim()) sp.set("q", q.trim());
      if (statusFilter) sp.set("status", statusFilter);
      if (featuredFilter) sp.set("featured", featuredFilter);
      if (categoryId) sp.set("categoryId", categoryId);
      const res = await fetch(`/api/admin/products?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setItems(json.items ?? []);
      setSelected({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, statusFilter, featuredFilter, categoryId]);

  useEffect(() => {
    const t = window.setTimeout(() => loadProducts(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setId("");
    setFormCategoryId(cats[0]?.id ?? "");
    setPriceVnd(69000);
    setSalePriceVnd("");
    setSizeTag("Gói 50g");
    setBadges("Best seller");
    setBaseStatus("ACTIVE");
    setFeatured(false);
    setSortOrder("");
    setThumbnailSrc("/products/product-01.jpg");
    setName("");
    setShortDesc("");
    setDescriptionJson(null);
    setDescriptionMarkdown("");
    setViFallback(null);
    setSaveError(null);
    setEditorKey(`create:${Date.now()}`);
    setDrawerOpen(true);
  }

  async function openEdit(pid: string) {
    const row = items.find((x) => x.id === pid) ?? null;
    setMode("edit");
    setEditing(row);
    setId(row?.id ?? "");
    setFormCategoryId(row?.categoryId ?? "");
    setPriceVnd(row?.priceVnd ?? 0);
    setSalePriceVnd(row?.salePriceVnd ?? "");
    setSizeTag(row?.sizeTag ?? "");
    setBadges((row?.badges ?? []).join(", "));
    setBaseStatus(row?.status ?? "ACTIVE");
    setFeatured(Boolean(row?.featured));
    setSortOrder(row?.sortOrder ?? "");
    setThumbnailSrc(row?.thumbnailSrc ?? "");
    setName(row?.translation?.name ?? "");
    setShortDesc(row?.translation?.shortDesc ?? "");
    setDescriptionJson(null);
    setDescriptionMarkdown("");
    setSaveError(null);
    setDrawerOpen(true);

    const res = await fetch(`/api/admin/products/${pid}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const t = (json?.item?.translations ?? []).find((x: any) => x.lang === lang);
      if (t) {
        setDescriptionJson(t.descriptionJson ?? null);
        setDescriptionMarkdown(t.descriptionMarkdown ?? "");
      }
      setEditorKey(`edit:${pid}:${lang}:${Date.now()}`);
      if (lang === "en") {
        const vi = (json?.item?.translations ?? []).find((x: any) => x.lang === "vi");
        setViFallback(
          vi
            ? {
                name: vi.name ?? "",
                shortDesc: vi.shortDesc ?? "",
                descriptionJson: vi.descriptionJson ?? null,
                descriptionMarkdown: vi.descriptionMarkdown ?? ""
              }
            : null
        );
      } else {
        setViFallback(null);
      }
    }
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const snap = editorSnapshotRef.current?.() ?? null;
      if (snap) {
        setDescriptionJson(snap.json);
        setDescriptionMarkdown(snap.html);
      }
      const payload = {
        lang,
        ...(mode === "create" && id.trim() ? { id: id.trim() } : {}),
        categoryId: formCategoryId,
        priceVnd,
        salePriceVnd: salePriceVnd === "" ? null : Number(salePriceVnd),
        sizeTag,
        badges: badges
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        status: baseStatus,
        featured,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        thumbnailSrc,
        name,
        shortDesc,
        descriptionJson: snap ? snap.json : descriptionJson,
        descriptionMarkdown: snap ? snap.html : descriptionMarkdown
      };

      const res =
        mode === "create"
          ? await fetch("/api/admin/products", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            })
          : await fetch(`/api/admin/products/${editing?.id}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            });

      if (!res.ok) throw new Error("save_failed");
      setDrawerOpen(false);
      await loadProducts();
    } catch {
      setSaveError("Không lưu được. Kiểm tra dữ liệu và thử lại.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function toggleStatus(pid: string, next: ProductRow["status"]) {
    setItems((prev) => prev.map((x) => (x.id === pid ? { ...x, status: next } : x)));
    const res = await fetch(`/api/admin/products/${pid}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang, status: next })
    });
    if (!res.ok) await loadProducts();
  }

  async function toggleFeatured(pid: string, next: boolean) {
    setItems((prev) => prev.map((x) => (x.id === pid ? { ...x, featured: next } : x)));
    const res = await fetch(`/api/admin/products/${pid}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang, featured: next })
    });
    if (!res.ok) await loadProducts();
  }

  async function bulk(action: "set_status_active" | "set_status_inactive" | "set_featured_true" | "set_featured_false") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids, action })
    });
    await loadProducts();
  }

  async function move(pid: string, dir: "up" | "down") {
    const idx = items.findIndex((x) => x.id === pid);
    if (idx < 0) return;
    const next = [...items];
    const j = dir === "up" ? idx - 1 : idx + 1;
    if (j < 0 || j >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    setItems(next);
    await fetch("/api/admin/products/reorder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: next.map((x) => x.id) })
    });
    await loadProducts();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Products</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.products.subtitle")} <span className="font-semibold">?lang</span>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => switchLang("vi")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  lang === "vi" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50"
                )}
                aria-label="Edit Vietnamese"
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => switchLang("en")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  lang === "en" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50"
                )}
                aria-label="Edit English"
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + {tAdmin(lang as any, "common.add_product")}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.search")}</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder={tAdmin(lang as any, "admin.products.search_placeholder")}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.products.category")}</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
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
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.products.featured")}</span>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <option value="">{tAdmin(lang as any, "common.all")}</option>
                <option value="true">{tAdmin(lang as any, "admin.products.featured_yes")}</option>
                <option value="false">{tAdmin(lang as any, "admin.products.featured_no")}</option>
              </select>
            </label>
          </div>
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
                {tAdmin(lang as any, "admin.products.bulk_set_active")}
              </button>
              <button
                type="button"
                onClick={() => bulk("set_status_inactive")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "admin.products.bulk_set_inactive")}
              </button>
              <button
                type="button"
                onClick={() => bulk("set_featured_true")}
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
              >
                {tAdmin(lang as any, "admin.products.bulk_set_featured")}
              </button>
              <button
                type="button"
                onClick={() => bulk("set_featured_false")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "admin.products.bulk_unset_featured")}
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
                  className="grid grid-cols-[28px_56px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setSelected((p) => ({ ...p, [row.id]: e.target.checked }))}
                    aria-label={`Select ${row.translation.name || row.id}`}
                  />

                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img src={row.thumbnailSrc} alt={row.translation.name} className="h-12 w-14 object-cover" />
                  </div>

                  <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {row.translation.name || <span className="text-slate-400">(chưa có tên)</span>}
                      </p>
                      {row.meta.missingLang ? <Pill tone="amber">EN thiếu</Pill> : null}
                      {row.featured ? <Pill tone="emerald">Featured</Pill> : null}
                      <Pill>{row.categoryName}</Pill>
                      {row.badges.slice(0, 2).map((b) => (
                        <Pill key={b}>{b}</Pill>
                      ))}
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-600">{row.translation.shortDesc}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{fmtVnd(row.priceVnd)}</span>
                      {row.salePriceVnd ? <span className="text-rose-700">Sale: {fmtVnd(row.salePriceVnd)}</span> : null}
                      <span>•</span>
                      <span>{row.sizeTag}</span>
                      <span>•</span>
                      <span>sortOrder: {row.sortOrder}</span>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => move(row.id, "up")}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => move(row.id, "down")}
                      disabled={idx === items.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(row.id, !row.featured)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      aria-label="Toggle featured"
                    >
                      {row.featured ? "★" : "☆"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(row.id, row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      aria-label="Toggle status"
                    >
                      {row.status}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              {tAdmin(lang as any, "admin.products.empty")}
            </div>
          )}
        </div>
      </div>

      <QuickEditDrawer
        width="half"
        open={drawerOpen}
        title={
          mode === "create"
            ? tAdmin(lang as any, "admin.products.create_title")
            : editing?.translation?.name
              ? `${tAdmin(lang as any, "common.edit")}: ${editing.translation.name}`
              : tAdmin(lang as any, "admin.products.edit_title")
        }
        subtitle={lang === "en" && viFallback ? `Fallback VI: ${viFallback.name}` : undefined}
        onClose={() => setDrawerOpen(false)}
      >
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fallback: VI</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.name}</p>
                <p className="mt-1 text-xs text-slate-600">{viFallback.shortDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setName((x) => x || viFallback.name);
                  setShortDesc((x) => x || viFallback.shortDesc);
                  if (viFallback.descriptionJson != null || (viFallback.descriptionMarkdown ?? "").trim()) {
                    setDescriptionJson(viFallback.descriptionJson ?? null);
                    setDescriptionMarkdown(viFallback.descriptionMarkdown ?? "");
                    setEditorKey((k) => k + ":copy");
                  }
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Copy VI → EN
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          {mode === "create" ? (
            <Field label={tAdmin(lang as any, "admin.products.id_optional")} hint={tAdmin(lang as any, "admin.products.id_hint")}>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                placeholder="p-enso-shoe-mini"
              />
            </Field>
          ) : null}

          <Field label={tAdmin(lang as any, "admin.products.name")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <Field label={tAdmin(lang as any, "admin.products.short_desc")}>
            <textarea
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>

          <div className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">{tAdmin(lang as any, "admin.products.detail_desc")}</span>
            <NewsEditor
              key={editorKey}
              initialContentJson={descriptionJson}
              initialContentHtml={descriptionMarkdown}
              titleForAlt={name}
              lang={lang as any}
              onChangeJson={(j) => setDescriptionJson(j)}
              onChangeHtml={(html) => setDescriptionMarkdown(html)}
              onProvideSnapshot={(get) => {
                editorSnapshotRef.current = get;
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.products.category")}>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={tAdmin(lang as any, "admin.products.size_tag")}>
              <input
                value={sizeTag}
                onChange={(e) => setSizeTag(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.products.price")}>
              <input
                type="number"
                value={priceVnd}
                onChange={(e) => setPriceVnd(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
            <Field label={tAdmin(lang as any, "admin.products.sale_price")}>
              <input
                type="number"
                value={salePriceVnd}
                onChange={(e) => setSalePriceVnd(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                placeholder="119000"
              />
            </Field>
          </div>

          <Field label={tAdmin(lang as any, "admin.products.thumbnail")} hint={tAdmin(lang as any, "admin.products.thumbnail_hint")}>
            <input
              value={thumbnailSrc}
              onChange={(e) => setThumbnailSrc(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>

          <FileUploader folder="uploads/products" value={thumbnailSrc} onChange={setThumbnailSrc} accept="image/*" />

          <Field label={tAdmin(lang as any, "admin.products.badges")} hint={tAdmin(lang as any, "admin.products.badges_hint")}>
            <input
              value={badges}
              onChange={(e) => setBadges(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field label={tAdmin(lang as any, "admin.products.flags")}>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  {tAdmin(lang as any, "admin.products.featured_yes")}
                </label>
              </div>
            </Field>
          </div>

          <Field label={tAdmin(lang as any, "admin.common.sort_order_optional")}>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>

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
              disabled={saveLoading || !name.trim() || !formCategoryId}
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


