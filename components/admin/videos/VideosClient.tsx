"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { VideoPreviewModal, type AdminVideo } from "@/components/admin/videos/VideoPreviewModal";
import { FileUploader } from "@/components/admin/FileUploader";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";
type VideoType = "YOUTUBE" | "MP4";
type Placement = "VIDEO_PROOF" | "HOW_TO_USE" | "OTHER";
type Status = "PUBLISHED" | "HIDDEN";

type Row = {
  id: string;
  type: VideoType;
  src: string;
  thumbnailSrc: string;
  duration: string;
  placement: Placement;
  status: Status;
  sortOrder: number;
  translation: { lang: Lang; title: string; caption: string };
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

export function VideosClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | VideoType>("");
  const [placementFilter, setPlacementFilter] = useState<"" | Placement>("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<Row | null>(null);

  // form
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [vtype, setVtype] = useState<VideoType>("YOUTUBE");
  const [src, setSrc] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [thumbnailSrc, setThumbnailSrc] = useState("/video-thumbs/video-1.png");
  const [duration, setDuration] = useState("0:45");
  const [placement, setPlacement] = useState<Placement>("VIDEO_PROOF");
  const [status, setStatus] = useState<Status>("PUBLISHED");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [viFallback, setViFallback] = useState<{ title: string; caption: string } | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [preview, setPreview] = useState<AdminVideo | null>(null);

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
      if (typeFilter) sp.set("type", typeFilter);
      if (placementFilter) sp.set("placement", placementFilter);
      if (statusFilter) sp.set("status", statusFilter);
      const res = await fetch(`/api/admin/videos?${sp.toString()}`, { cache: "no-store" });
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
  }, [lang, typeFilter, placementFilter, statusFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setTitle("");
    setCaption("");
    setVtype("YOUTUBE");
    setSrc("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    setThumbnailSrc("/video-thumbs/video-1.png");
    setDuration("0:45");
    setPlacement("VIDEO_PROOF");
    setStatus("PUBLISHED");
    setSortOrder("");
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setTitle(row?.translation?.title ?? "");
    setCaption(row?.translation?.caption ?? "");
    setVtype(row?.type ?? "YOUTUBE");
    setSrc(row?.src ?? "");
    setThumbnailSrc(row?.thumbnailSrc ?? "");
    setDuration(row?.duration ?? "");
    setPlacement(row?.placement ?? "VIDEO_PROOF");
    setStatus(row?.status ?? "PUBLISHED");
    setSortOrder(row?.sortOrder ?? "");
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const res = await fetch(`/api/admin/videos/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const vi = (json?.item?.translations ?? []).find((t: any) => t.lang === "vi");
        setViFallback(vi ? { title: vi.title ?? "", caption: vi.caption ?? "" } : null);
      }
    } else setViFallback(null);
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const payload = {
        lang,
        title,
        caption,
        type: vtype,
        src,
        thumbnailSrc,
        duration,
        placement,
        status,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder)
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/videos", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
          : await fetch(`/api/admin/videos/${editing?.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("save_failed");
      setDrawerOpen(false);
      await load();
    } catch {
      setSaveError("Không lưu được. Kiểm tra dữ liệu và thử lại.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function toggleStatus(id: string, next: Status) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const res = await fetch(`/api/admin/videos/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, status: next }) });
    if (!res.ok) await load();
  }

  async function bulk(action: "set_status_published" | "set_status_hidden") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/videos/bulk", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids, action }) });
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
    await fetch("/api/admin/videos/reorder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "admin.videos.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.videos.subtitle")} <span className="font-semibold">?lang</span>.
            </p>
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

        <div className="mt-4 grid gap-3 md:grid-cols-5 md:items-end">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.search")}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.videos.search_placeholder")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.videos.placement")}</span>
            <select value={placementFilter} onChange={(e) => setPlacementFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="VIDEO_PROOF">{tAdmin(lang as any, "admin.videos.placement_video_proof")}</option>
              <option value="HOW_TO_USE">{tAdmin(lang as any, "admin.videos.placement_how_to_use")}</option>
              <option value="OTHER">{tAdmin(lang as any, "admin.videos.placement_other")}</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.videos.type")}</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="YOUTUBE">{tAdmin(lang as any, "admin.videos.type_youtube")}</option>
              <option value="MP4">{tAdmin(lang as any, "admin.videos.type_mp4")}</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.status")}</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="PUBLISHED">{tAdmin(lang as any, "admin.videos.status_published")}</option>
              <option value="HIDDEN">{tAdmin(lang as any, "admin.videos.status_hidden")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">{tAdmin(lang as any, "common.selected")}: {selectedIds.length}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => bulk("set_status_published")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">{tAdmin(lang as any, "common.publish")}</button>
              <button type="button" onClick={() => bulk("set_status_hidden")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.hide")}</button>
              <button type="button" onClick={() => setSelected({})} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.clear")}</button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((row, idx) => (
              <div key={row.id} className="grid grid-cols-[28px_96px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <input type="checkbox" checked={Boolean(selected[row.id])} onChange={(e) => setSelected((p) => ({ ...p, [row.id]: e.target.checked }))} aria-label={`Select ${row.translation.title || row.id}`} />
                <button type="button" className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50" onClick={() => setPreview({ title: row.translation.title || row.id, type: row.type, src: row.src })}>
                  <img src={row.thumbnailSrc} alt={row.translation.title} className="h-14 w-24 object-cover" />
                  <span className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-white">{row.duration}</span>
                </button>
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{row.translation.title || row.id}</p>
                    <Pill>{row.placement === "VIDEO_PROOF" ? tAdmin(lang as any, "admin.videos.placement_video_proof") : row.placement === "HOW_TO_USE" ? tAdmin(lang as any, "admin.videos.placement_how_to_use") : tAdmin(lang as any, "admin.videos.placement_other")}</Pill>
                    <Pill>{row.type === "YOUTUBE" ? tAdmin(lang as any, "admin.videos.type_youtube") : tAdmin(lang as any, "admin.videos.type_mp4")}</Pill>
                    {row.status === "PUBLISHED" ? <Pill tone="emerald">{tAdmin(lang as any, "admin.videos.status_published")}</Pill> : <Pill>{tAdmin(lang as any, "admin.videos.status_hidden")}</Pill>}
                    {row.meta.missingLang ? <Pill tone="amber">{tAdmin(lang as any, "admin.videos.pill_missing_en")}</Pill> : null}
                    <Pill>{tAdmin(lang as any, "admin.videos.pill_sort").replace("{n}", String(row.sortOrder))}</Pill>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-600">{row.translation.caption}</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">{row.src}</p>
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "up")} disabled={idx === 0} aria-label={tAdmin(lang as any, "admin.common.move_up")}>↑</button>
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "down")} disabled={idx === items.length - 1} aria-label={tAdmin(lang as any, "admin.common.move_down")}>↓</button>
                  <button type="button" onClick={() => toggleStatus(row.id, row.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">{row.status === "PUBLISHED" ? tAdmin(lang as any, "admin.videos.quick_hide") : tAdmin(lang as any, "admin.videos.quick_publish")}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{tAdmin(lang as any, "admin.videos.empty")}</div>
        )}
      </div>

      <QuickEditDrawer
        open={drawerOpen}
        title={mode === "create" ? tAdmin(lang as any, "admin.videos.drawer_create") : editing?.translation?.title ? tAdmin(lang as any, "admin.videos.drawer_edit_name").replace("{name}", editing.translation.title) : tAdmin(lang as any, "admin.videos.drawer_edit")}
        subtitle={lang === "en" && viFallback ? `${tAdmin(lang as any, "admin.videos.fallback_vi")}: ${viFallback.title}` : undefined}
        onClose={() => setDrawerOpen(false)}
      >
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.videos.fallback_vi")}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.title}</p>
                <p className="mt-1 text-xs text-slate-600">{viFallback.caption}</p>
              </div>
              <button type="button" onClick={() => { setTitle((x) => x || viFallback.title); setCaption((x) => x || viFallback.caption); }} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "admin.videos.copy_vi_en")}</button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          <Field label={tAdmin(lang as any, "admin.videos.form_title")}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label={tAdmin(lang as any, "admin.videos.form_caption")}>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          <Field label={tAdmin(lang as any, "admin.videos.form_src")} hint={vtype === "YOUTUBE" ? tAdmin(lang as any, "admin.videos.form_src_hint_youtube") : tAdmin(lang as any, "admin.videos.form_src_hint_mp4")}>
            <input value={src} onChange={(e) => setSrc(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          {vtype === "MP4" ? (
            <FileUploader folder="uploads/videos" value={src} onChange={setSrc} accept="video/mp4" />
          ) : null}
          <Field label={tAdmin(lang as any, "admin.videos.form_thumbnail")}>
            <FileUploader folder="uploads/videos" value={thumbnailSrc} onChange={setThumbnailSrc} accept="image/*" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tAdmin(lang as any, "admin.videos.form_duration")}>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.videos.form_duration_placeholder")} />
            </Field>
            <Field label={tAdmin(lang as any, "admin.videos.form_status")}>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                <option value="PUBLISHED">{tAdmin(lang as any, "admin.videos.status_published")}</option>
                <option value="HIDDEN">{tAdmin(lang as any, "admin.videos.status_hidden")}</option>
              </select>
            </Field>
          </div>
          <Field label={tAdmin(lang as any, "admin.videos.form_sort_order")}>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.cancel")}</button>
            <button type="button" onClick={save} disabled={saveLoading || !title.trim() || !src.trim() || !thumbnailSrc.trim() || !duration.trim()} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">{saveLoading ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}</button>
          </div>
        </div>
      </QuickEditDrawer>

      <VideoPreviewModal open={Boolean(preview)} video={preview} onClose={() => setPreview(null)} />
    </div>
  );
}


