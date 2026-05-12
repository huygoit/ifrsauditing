"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { ImageModal } from "@/components/ImageModal";
import { FileUploader } from "@/components/admin/FileUploader";

type Lang = "vi" | "en";
type CertType = "CERTIFICATION" | "AWARD";
type CertStatus = "PUBLISHED" | "HIDDEN";

type CertificationRow = {
  id: string;
  type: CertType;
  logoSrc: string;
  certificateImageSrc: string | null;
  issuedDate: string | null;
  issuer: string | null;
  status: CertStatus;
  sortOrder: number;
  translation: { lang: Lang; title: string; description: string; note: string };
  meta: { missingLang: boolean; hasVi: boolean };
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

function StatusPill({ status }: { status: CertStatus }) {
  return status === "PUBLISHED" ? <Pill tone="emerald">PUBLISHED</Pill> : <Pill>HIDDEN</Pill>;
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

export function CertificationsClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | CertType>("");
  const [statusFilter, setStatusFilter] = useState<"" | CertStatus>("");
  const [view, setView] = useState<"list" | "gallery">("gallery");

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CertificationRow[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<CertificationRow | null>(null);

  // form state
  const [certType, setCertType] = useState<CertType>("CERTIFICATION");
  const [certStatus, setCertStatus] = useState<CertStatus>("PUBLISHED");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [logoSrc, setLogoSrc] = useState("/trust/iso.png");
  const [certificateImageSrc, setCertificateImageSrc] = useState<string>("/certs/certs-1.png");
  const [issuer, setIssuer] = useState("");
  const [issuedDate, setIssuedDate] = useState(""); // YYYY-MM-DD

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [viFallback, setViFallback] = useState<{ title: string; description: string; note: string } | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [preview, setPreview] = useState<{ title: string; src: string } | null>(null);

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
      if (statusFilter) sp.set("status", statusFilter);
      const res = await fetch(`/api/admin/certifications?${sp.toString()}`, { cache: "no-store" });
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
  }, [lang, typeFilter, statusFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setCertType("CERTIFICATION");
    setCertStatus("PUBLISHED");
    setSortOrder("");
    setLogoSrc("/trust/iso.png");
    setCertificateImageSrc("/certs/certs-1.png");
    setIssuer("");
    setIssuedDate("");
    setTitle("");
    setDescription("");
    setNote("");
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setCertType(row?.type ?? "CERTIFICATION");
    setCertStatus(row?.status ?? "PUBLISHED");
    setSortOrder(row?.sortOrder ?? "");
    setLogoSrc(row?.logoSrc ?? "");
    setCertificateImageSrc(row?.certificateImageSrc ?? "");
    setIssuer(row?.issuer ?? "");
    setIssuedDate(row?.issuedDate ? row.issuedDate.slice(0, 10) : "");
    setTitle(row?.translation?.title ?? "");
    setDescription(row?.translation?.description ?? "");
    setNote(row?.translation?.note ?? "");
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const res = await fetch(`/api/admin/certifications/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const vi = (json?.item?.translations ?? []).find((t: any) => t.lang === "vi");
        setViFallback(
          vi
            ? { title: vi.title ?? "", description: vi.description ?? "", note: vi.note ?? "" }
            : null
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
        type: certType,
        status: certStatus,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        logoSrc,
        certificateImageSrc: certificateImageSrc.trim() ? certificateImageSrc.trim() : null,
        issuer: issuer.trim() ? issuer.trim() : null,
        issuedDate: issuedDate.trim() ? issuedDate.trim() : null,
        title,
        description,
        note
      };

      const res =
        mode === "create"
          ? await fetch("/api/admin/certifications", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            })
          : await fetch(`/api/admin/certifications/${editing?.id}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            });

      if (!res.ok) throw new Error("save_failed");
      setDrawerOpen(false);
      await load();
    } catch {
      setSaveError("Không lưu được. Kiểm tra dữ liệu và thử lại.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function toggleStatus(id: string, next: CertStatus) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang, status: next })
    });
    if (!res.ok) await load();
  }

  async function bulk(action: "set_status_published" | "set_status_hidden") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/certifications/bulk", {
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
    await fetch("/api/admin/certifications/reorder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: next.map((x) => x.id) })
    });
    await load();
  }

  const actionBar = (
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
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setView("gallery")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", view === "gallery" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50")}
        >
          Gallery
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", view === "list" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50")}
        >
          List
        </button>
      </div>
      <button
        type="button"
        onClick={openCreate}
        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        + Add
      </button>
    </div>
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Certifications</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Chứng nhận & giải thưởng: gallery/list, preview modal, sort/status + translations theo <span className="font-semibold">?lang</span>.
            </p>
          </div>
          {actionBar}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder="Title/description…"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <option value="">All</option>
              <option value="CERTIFICATION">CERTIFICATION</option>
              <option value="AWARD">AWARD</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <option value="">All</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">Selected: {selectedIds.length}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => bulk("set_status_published")}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => bulk("set_status_hidden")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Hide
              </button>
              <button
                type="button"
                onClick={() => setSelected({})}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : items.length ? (
          view === "gallery" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, idx) => (
                <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" className="min-w-0 text-left" onClick={() => openEdit(c.id)}>
                      <p className="truncate text-sm font-semibold text-slate-900">{c.translation.title || c.id}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Pill>{c.type}</Pill>
                        <StatusPill status={c.status} />
                        {c.meta.missingLang ? <Pill tone="amber">EN thiếu</Pill> : null}
                        <Pill>sort: {c.sortOrder}</Pill>
                      </div>
                    </button>
                    <input
                      type="checkbox"
                      checked={Boolean(selected[c.id])}
                      onChange={(e) => setSelected((p) => ({ ...p, [c.id]: e.target.checked }))}
                      aria-label={`Select ${c.translation.title || c.id}`}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-700">Logo</p>
                      <div className="mt-2 aspect-[3/2] overflow-hidden rounded-2xl bg-white">
                        <img src={c.logoSrc} alt="logo" className="h-full w-full object-cover" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-700">Certificate</p>
                        {c.certificateImageSrc ? (
                          <button
                            type="button"
                            onClick={() => setPreview({ title: c.translation.title || "Certificate", src: c.certificateImageSrc! })}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            Preview
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-2 aspect-[3/2] overflow-hidden rounded-2xl bg-white">
                        {c.certificateImageSrc ? (
                          <img src={c.certificateImageSrc} alt="certificate" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-slate-600">
                      {c.issuer ? <span className="font-semibold text-slate-900">{c.issuer}</span> : <span>—</span>}
                      {c.issuedDate ? <span className="text-slate-400"> • </span> : null}
                      {c.issuedDate ? <span>{c.issuedDate.slice(0, 10)}</span> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                        onClick={() => move(c.id, "up")}
                        disabled={idx === 0}
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                        onClick={() => move(c.id, "down")}
                        disabled={idx === items.length - 1}
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(c.id, c.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      >
                        {c.status === "PUBLISHED" ? "Hide" : "Publish"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {items.map((c, idx) => (
                <div
                  key={c.id}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(selected[c.id])}
                    onChange={(e) => setSelected((p) => ({ ...p, [c.id]: e.target.checked }))}
                    aria-label={`Select ${c.translation.title || c.id}`}
                  />

                  <button type="button" className="min-w-0 text-left" onClick={() => openEdit(c.id)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{c.translation.title || c.id}</p>
                      <Pill>{c.type}</Pill>
                      <StatusPill status={c.status} />
                      {c.meta.missingLang ? <Pill tone="amber">EN thiếu</Pill> : null}
                      <Pill>sort: {c.sortOrder}</Pill>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-600">{c.translation.description}</p>
                  </button>

                  <div className="flex items-center gap-2">
                    {c.certificateImageSrc ? (
                      <button
                        type="button"
                        onClick={() => setPreview({ title: c.translation.title || "Certificate", src: c.certificateImageSrc! })}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                      >
                        Preview
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => move(c.id, "up")}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => move(c.id, "down")}
                      disabled={idx === items.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(c.id, c.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      {c.status === "PUBLISHED" ? "Hide" : "Publish"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Chưa có item. Bấm <span className="font-semibold">Add</span> để tạo.
          </div>
        )}
      </div>

      <QuickEditDrawer
        open={drawerOpen}
        title={mode === "create" ? "Create certification" : editing?.translation?.title ? `Edit: ${editing.translation.title}` : "Edit certification"}
        subtitle={lang === "en" && viFallback ? `Fallback VI: ${viFallback.title}` : undefined}
        onClose={() => setDrawerOpen(false)}
      >
        {lang === "en" && viFallback ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fallback: VI</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{viFallback.title}</p>
                <p className="mt-1 text-xs text-slate-600">{viFallback.description}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTitle((x) => x || viFallback.title);
                  setDescription((x) => x || viFallback.description);
                  setNote((x) => x || viFallback.note);
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Copy VI → EN
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          <Field label="Title (translation)">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <Field label="Description (translation)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <Field label="Note (translation)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type (base)">
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <option value="CERTIFICATION">CERTIFICATION</option>
                <option value="AWARD">AWARD</option>
              </select>
            </Field>
            <Field label="Status (base)">
              <select
                value={certStatus}
                onChange={(e) => setCertStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="HIDDEN">HIDDEN</option>
              </select>
            </Field>
          </div>

          <Field label="Logo src" hint="VD: /trust/iso.png hoặc /uploads/xxx.png">
            <input
              value={logoSrc}
              onChange={(e) => setLogoSrc(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </Field>
          <FileUploader folder="uploads/certifications" value={logoSrc} onChange={setLogoSrc} accept="image/*" />

          <Field label="Certificate image src (optional)" hint="VD: /certs/certs-1.png hoặc /uploads/xxx.png">
            <input
              value={certificateImageSrc}
              onChange={(e) => setCertificateImageSrc(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
            <div className="flex flex-wrap gap-2">
              {certificateImageSrc.trim() ? (
                <button
                  type="button"
                  onClick={() => setPreview({ title: title || "Certificate", src: certificateImageSrc })}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Preview
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setCertificateImageSrc("")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </Field>
          <FileUploader
            folder="uploads/certifications"
            value={certificateImageSrc}
            onChange={setCertificateImageSrc}
            accept="image/*"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Issuer (optional)">
              <input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                placeholder="OCOP / ISO…"
              />
            </Field>
            <Field label="Issued date (optional)" hint="YYYY-MM-DD">
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              />
            </Field>
          </div>

          <Field label="sortOrder (optional)">
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
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saveLoading || !title.trim() || !logoSrc.trim()}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {saveLoading ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </QuickEditDrawer>

      <ImageModal
        open={Boolean(preview)}
        title={preview?.title ?? "Preview"}
        src={preview?.src ?? ""}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}


