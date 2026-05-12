"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { FileUploader } from "@/components/admin/FileUploader";
import { tAdmin } from "@/lib/admin/i18n";
import { sanitizeHtmlForNews } from "@/lib/markdown";
import { NewsEditor } from "@/components/admin/news/NewsEditor";
import { slugifyAscii } from "@/lib/slug";

type Lang = "vi" | "en";
type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

type Row = {
  id: string;
  siteContentCategoryId?: string | null;
  coverImage: string | null;
  author: string | null;
  publishedAt: string | null;
  status: PostStatus;
  tags: string[];
  sortOrder: number;
  translation: { lang: Lang; title: string; excerpt: string; slug: string };
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

export function SiteContentsClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | PostStatus>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<Row | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [siteContentCategoryId, setSiteContentCategoryId] = useState<string>("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [contentJson, setContentJson] = useState<any | null>(null);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  const [status, setStatus] = useState<PostStatus>("PUBLISHED");
  const [publishedAt, setPublishedAt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("enso, eco");
  const [sortOrder, setSortOrder] = useState<number | "">("");

  const [viFallback, setViFallback] = useState<{ title: string; excerpt: string; slug: string; contentMarkdown: string } | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const previewHtml = useMemo(() => sanitizeHtmlForNews(contentMarkdown), [contentMarkdown]);
  const editorSnapshotRef = useRef<null | (() => { json: any; html: string })>(null);
  const [editorKey, setEditorKey] = useState(() => `init:${Date.now()}`);
  const [siteContentCategories, setSiteContentCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  function statusLabel(s: PostStatus) {
    if (s === "DRAFT") return tAdmin(lang as any, "admin.posts.status.draft");
    if (s === "PUBLISHED") return tAdmin(lang as any, "admin.posts.status.published");
    return tAdmin(lang as any, "admin.posts.status.scheduled");
  }

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const l = sp.get("lang");
    setLang(l === "en" ? "en" : "vi");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const sp = new URLSearchParams();
        sp.set("lang", lang);
        sp.set("status", "ACTIVE");
        const res = await fetch(`/api/admin/site-content-categories?${sp.toString()}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({} as any));
        const items = Array.isArray(json?.items) ? json.items : [];
        setSiteContentCategories(
          items
            .map((x: any) => ({
              id: String(x.id ?? ""),
              name: String(x?.translation?.name ?? ""),
              slug: String(x?.translation?.slug ?? "")
            }))
            .filter((x: any) => x.id)
        );
      } catch {
        setSiteContentCategories([]);
      }
    })();
  }, [lang]);

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
      const res = await fetch(`/api/admin/site-contents?${sp.toString()}`, { cache: "no-store" });
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
    setTitle("");
    setSlug("");
    setExcerpt("");
    setSiteContentCategoryId("");
    setContentMarkdown("");
    setContentJson(null);
    setSeoTitle("");
    setSeoDesc("");
    setStatus("PUBLISHED");
    setPublishedAt("");
    setCoverImage("");
    setAuthor("");
    setTags("enso, eco");
    setSortOrder("");
    setViFallback(null);
    setSaveError(null);
    setPreviewMode("edit");
    setEditorKey(`create:${lang}:${Date.now()}`);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setStatus(row?.status ?? "DRAFT");
    setPublishedAt(row?.publishedAt ? row.publishedAt.slice(0, 16) : "");
    setCoverImage(row?.coverImage ?? "");
    setAuthor(row?.author ?? "");
    setTags((row?.tags ?? []).join(", "));
    setSortOrder(row?.sortOrder ?? "");
    setTitle(row?.translation?.title ?? "");
    setSlug(row?.translation?.slug ?? "");
    setExcerpt(row?.translation?.excerpt ?? "");
    setSiteContentCategoryId(String((row as any)?.siteContentCategoryId ?? ""));
    setContentMarkdown("");
    setContentJson(null);
    setSeoTitle("");
    setSeoDesc("");
    setSaveError(null);
    setPreviewMode("edit");
    setDrawerOpen(true);

    const res = await fetch(`/api/admin/site-contents/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setSiteContentCategoryId(String((json as any)?.item?.siteContentCategoryId ?? ""));
      const t = (json?.item?.translations ?? []).find((x: any) => x.lang === lang);
      if (t) {
        setTitle(t.title ?? "");
        setSlug(t.slug ?? "");
        setExcerpt(t.excerpt ?? "");
        setContentMarkdown(t.contentMarkdown ?? "");
        setContentJson(t.contentJson ?? null);
        setSeoTitle(t.seoTitle ?? "");
        setSeoDesc(t.seoDesc ?? "");
      }
      if (lang === "en") {
        const vi = (json?.item?.translations ?? []).find((x: any) => x.lang === "vi");
        setViFallback(
          vi
            ? { title: vi.title ?? "", excerpt: vi.excerpt ?? "", slug: vi.slug ?? "", contentMarkdown: vi.contentMarkdown ?? "" }
            : null
        );
      } else setViFallback(null);
      setEditorKey(`edit:${id}:${lang}:${Date.now()}`);
    }
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      // Ensure we capture the latest editor content even if the user clicks Save before debounced state sync.
      const snap = editorSnapshotRef.current?.() ?? null;
      if (snap) {
        setContentJson(snap.json);
        setContentMarkdown(snap.html);
      }

      const normalizedSlug = slugifyAscii(slug.trim() ? slug : title);
      if (normalizedSlug !== slug) setSlug(normalizedSlug);
      const payload = {
        lang,
        status,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        siteContentCategoryId: siteContentCategoryId.trim() ? siteContentCategoryId.trim() : null,
        coverImage: coverImage.trim() ? coverImage.trim() : null,
        author: author.trim() ? author.trim() : null,
        tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        slug: normalizedSlug,
        title: title.trim(),
        excerpt,
        contentMarkdown: snap ? snap.html : contentMarkdown,
        contentJson: snap ? snap.json : contentJson,
        seoTitle,
        seoDesc
      };
      const url = mode === "create" ? "/api/admin/site-contents" : `/api/admin/site-contents/${editing?.id}`;
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
      if (!res) throw new Error("save_failed");
      if (res.status === 409) throw new Error("slug_conflict");
      if (!res.ok) throw new Error("save_failed");
      setDrawerOpen(false);
      await load();
    } catch (e: any) {
      setSaveError(
        e?.message === "slug_conflict"
          ? tAdmin(lang as any, "admin.posts.error.slug_conflict")
          : tAdmin(lang as any, "admin.posts.error.save_failed")
      );
    } finally {
      setSaveLoading(false);
    }
  }

  async function bulk(action: "set_status_draft" | "set_status_published" | "set_status_scheduled") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/site-contents/bulk", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids, action }) });
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
    await fetch("/api/admin/site-contents/reorder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "admin.site_contents.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.site_contents.subtitle")} <span className="font-semibold">?lang</span>.
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
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.site_contents.search_placeholder")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.status")}</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="DRAFT">{tAdmin(lang as any, "admin.posts.status.draft")}</option>
              <option value="PUBLISHED">{tAdmin(lang as any, "admin.posts.status.published")}</option>
              <option value="SCHEDULED">{tAdmin(lang as any, "admin.posts.status.scheduled")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">{tAdmin(lang as any, "common.selected")}: {selectedIds.length}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => bulk("set_status_draft")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "admin.posts.bulk.draft")}</button>
              <button type="button" onClick={() => bulk("set_status_published")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">{tAdmin(lang as any, "admin.posts.bulk.publish")}</button>
              <button type="button" onClick={() => bulk("set_status_scheduled")} className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100">{tAdmin(lang as any, "admin.posts.bulk.schedule")}</button>
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
            {items.map((row, idx) => (
              <div key={row.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <input type="checkbox" checked={Boolean(selected[row.id])} onChange={(e) => setSelected((p) => ({ ...p, [row.id]: e.target.checked }))} />
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{row.translation.title || row.id}</p>
                    <Pill>{statusLabel(row.status)}</Pill>
                    {row.meta.missingLang ? <Pill tone="amber">{tAdmin(lang as any, "admin.common.missing_en")}</Pill> : null}
                    <Pill>{tAdmin(lang as any, "admin.common.sort_prefix")} {row.sortOrder}</Pill>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-600">{row.translation.excerpt}</p>
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "up")} disabled={idx === 0}>↑</button>
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "down")} disabled={idx === items.length - 1}>↓</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{tAdmin(lang as any, "admin.site_contents.empty")}</div>
        )}
      </div>

      <QuickEditDrawer
        open={drawerOpen}
        title={
          mode === "create"
            ? tAdmin(lang as any, "admin.site_contents.drawer.create")
            : editing?.translation?.title
              ? `${tAdmin(lang as any, "admin.site_contents.drawer.edit_prefix")} ${editing.translation.title}`
              : tAdmin(lang as any, "admin.site_contents.drawer.edit_prefix")
        }
        subtitle={lang === "en" && viFallback ? `${tAdmin(lang as any, "admin.common.fallback_vi_prefix")} ${viFallback.title}` : undefined}
        onClose={() => setDrawerOpen(false)}
        width="wide"
      >
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.common.fallback_vi_label")}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.title}</p>
                <p className="mt-1 text-xs text-slate-600">{viFallback.excerpt}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTitle((x) => x || viFallback.title);
                  setExcerpt((x) => x || viFallback.excerpt);
                  setContentMarkdown((x) => x || viFallback.contentMarkdown);
                  setContentJson(null);
                  setEditorKey(`copy:${editing?.id ?? "new"}:${lang}:${Date.now()}`);
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang as any, "admin.common.copy_vi_to_en")}
              </button>
            </div>
          </div>
        ) : null}

        <div className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setPreviewMode("edit")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              previewMode === "edit" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
            )}
          >
            {tAdmin(lang as any, "admin.posts.editor.tab_edit")}
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("preview")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              previewMode === "preview" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
            )}
          >
            {tAdmin(lang as any, "admin.posts.editor.tab_preview")}
          </button>
        </div>

        <div className="grid gap-4">
          <Field label={tAdmin(lang as any, "admin.posts.form.title")}>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug.trim()) setSlug(slugifyAscii(e.target.value));
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <Field label={tAdmin(lang as any, "admin.posts.form.excerpt")}>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          <Field label={tAdmin(lang as any, "admin.site_contents.form.category")}>
            <select
              value={siteContentCategoryId}
              onChange={(e) => setSiteContentCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <option value="">{tAdmin(lang as any, "admin.site_contents.form.category_none")}</option>
              {siteContentCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ? c.name : c.slug ? `/${c.slug}` : c.id}
                  {c.slug ? `  (/${c.slug})` : ""}
                </option>
              ))}
            </select>
          </Field>

          {previewMode === "edit" ? (
            <div className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900">{tAdmin(lang as any, "admin.posts.form.content")}</span>
              <NewsEditor
                key={editorKey}
                initialContentJson={contentJson}
                initialContentHtml={contentMarkdown}
                titleForAlt={title}
                lang={lang as any}
                onChangeJson={(j) => setContentJson(j)}
                onChangeHtml={(html) => setContentMarkdown(html)}
                onProvideSnapshot={(get) => {
                  editorSnapshotRef.current = get;
                }}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {previewHtml ? (
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              ) : (
                <p className="text-sm text-slate-600">{tAdmin(lang as any, "admin.posts.form.preview_empty")}</p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.posts.form.status")}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <option value="DRAFT">{tAdmin(lang as any, "admin.posts.status.draft")}</option>
                <option value="PUBLISHED">{tAdmin(lang as any, "admin.posts.status.published")}</option>
                {/* Hide scheduling in UI. Keep value only when editing existing scheduled posts. */}
                {status === "SCHEDULED" ? <option value="SCHEDULED">{tAdmin(lang as any, "admin.posts.status.scheduled")}</option> : null}
              </select>
            </Field>

            <Field label={tAdmin(lang as any, "admin.posts.form.author")}>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                placeholder={tAdmin(lang as any, "admin.posts.form.author_placeholder")}
              />
            </Field>
          </div>
          <Field label={tAdmin(lang as any, "admin.posts.form.cover_image")}>
            <FileUploader folder="uploads/site-contents" value={coverImage} onChange={setCoverImage} accept="image/*" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.posts.form.tags")}>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
            <Field label={tAdmin(lang as any, "admin.posts.form.sort_order")}>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.posts.form.seo_title")}>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
            </Field>
            <Field label={tAdmin(lang as any, "admin.posts.form.seo_desc")}>
              <input value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
            </Field>
          </div>

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.cancel")}</button>
            <button
              type="button"
              onClick={save}
              disabled={saveLoading || !title.trim()}
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


