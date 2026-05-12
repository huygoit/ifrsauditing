"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { FileUploader } from "@/components/admin/FileUploader";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";
type Group = "PARTNER" | "DISTRIBUTOR" | "CUSTOMER";
type Status = "PUBLISHED" | "HIDDEN";

type Row = {
  id: string;
  logoSrc: string;
  link: string | null;
  group: Group;
  status: Status;
  sortOrder: number;
  translation: { lang: Lang; name: string; shortDesc: string };
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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function PartnersClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [q, setQ] = useState("");
  const [groupFilter, setGroupFilter] = useState<"" | Group>("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<Row | null>(null);

  // form
  const [logoSrc, setLogoSrc] = useState("/trust/partner-01.png");
  const [link, setLink] = useState("");
  const [group, setGroup] = useState<Group>("PARTNER");
  const [status, setStatus] = useState<Status>("PUBLISHED");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [viFallback, setViFallback] = useState<{ name: string; shortDesc: string } | null>(null);
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
      if (groupFilter) sp.set("group", groupFilter);
      if (statusFilter) sp.set("status", statusFilter);
      const res = await fetch(`/api/admin/partners?${sp.toString()}`, { cache: "no-store" });
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
  }, [lang, groupFilter, statusFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setLogoSrc("/trust/partner-01.png");
    setLink("");
    setGroup("PARTNER");
    setStatus("PUBLISHED");
    setSortOrder("");
    setName("");
    setShortDesc("");
    setViFallback(null);
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setLogoSrc(row?.logoSrc ?? "");
    setLink(row?.link ?? "");
    setGroup(row?.group ?? "PARTNER");
    setStatus(row?.status ?? "PUBLISHED");
    setSortOrder(row?.sortOrder ?? "");
    setName(row?.translation?.name ?? "");
    setShortDesc(row?.translation?.shortDesc ?? "");
    setSaveError(null);
    setDrawerOpen(true);

    if (lang === "en") {
      const res = await fetch(`/api/admin/partners/${id}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const vi = (json?.item?.translations ?? []).find((t: any) => t.lang === "vi");
        setViFallback(vi ? { name: vi.name ?? "", shortDesc: vi.shortDesc ?? "" } : null);
      }
    } else setViFallback(null);
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const payload = {
        lang,
        logoSrc,
        link: link.trim() ? link.trim() : null,
        group,
        status,
        sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
        name,
        shortDesc
      };
      const res =
        mode === "create"
          ? await fetch("/api/admin/partners", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
          : await fetch(`/api/admin/partners/${editing?.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
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
    const res = await fetch(`/api/admin/partners/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ lang, status: next }) });
    if (!res.ok) await load();
  }

  async function bulk(action: "set_status_published" | "set_status_hidden") {
    const ids = selectedIds;
    if (!ids.length) return;
    await fetch("/api/admin/partners/bulk", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids, action }) });
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
    await fetch("/api/admin/partners/reorder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Partners</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.partners.subtitle")} <span className="font-semibold">?lang</span>.
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

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "common.search")}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder={tAdmin(lang as any, "admin.partners.search_placeholder")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang as any, "admin.partners.group")}</span>
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">{tAdmin(lang as any, "common.all")}</option>
              <option value="PARTNER">PARTNER</option>
              <option value="DISTRIBUTOR">DISTRIBUTOR</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
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
              <div key={row.id} className="grid grid-cols-[28px_56px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <input type="checkbox" checked={Boolean(selected[row.id])} onChange={(e) => setSelected((p) => ({ ...p, [row.id]: e.target.checked }))} aria-label={`Select ${row.translation.name || row.id}`} />
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img src={row.logoSrc} alt={row.translation.name} className="h-12 w-14 object-cover" />
                </div>
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(row.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{row.translation.name || row.id}</p>
                    <Pill>{row.group}</Pill>
                    {row.status === "PUBLISHED" ? <Pill tone="emerald">PUBLISHED</Pill> : <Pill>HIDDEN</Pill>}
                    {row.meta.missingLang ? <Pill tone="amber">EN thiếu</Pill> : null}
                    <Pill>sort: {row.sortOrder}</Pill>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-600">{row.translation.shortDesc}</p>
                  {row.link ? <p className="mt-1 truncate text-[11px] text-slate-500">{row.link}</p> : null}
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "up")} disabled={idx === 0} aria-label="Move up">↑</button>
                  <button type="button" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40" onClick={() => move(row.id, "down")} disabled={idx === items.length - 1} aria-label="Move down">↓</button>
                  <button type="button" onClick={() => toggleStatus(row.id, row.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                    {row.status === "PUBLISHED" ? "Hide" : "Publish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{tAdmin(lang as any, "admin.partners.empty")}</div>
        )}
      </div>

      <QuickEditDrawer
        open={drawerOpen}
        title={mode === "create" ? "Create partner" : editing?.translation?.name ? `Edit: ${editing.translation.name}` : "Edit partner"}
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
              <button type="button" onClick={() => { setName((x) => x || viFallback.name); setShortDesc((x) => x || viFallback.shortDesc); }} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                Copy VI → EN
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4">
          <Field label="Name (translation)">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label="Short desc (translation)">
            <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Group (base)">
              <select value={group} onChange={(e) => setGroup(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                <option value="PARTNER">PARTNER</option>
                <option value="DISTRIBUTOR">DISTRIBUTOR</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
            </Field>
            <Field label="Status (base)">
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="HIDDEN">HIDDEN</option>
              </select>
            </Field>
          </div>

          <Field label="Logo src" hint="VD: /trust/partner-01.png hoặc /uploads/xxx.png">
            <input value={logoSrc} onChange={(e) => setLogoSrc(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <FileUploader folder="uploads/partners" value={logoSrc} onChange={setLogoSrc} accept="image/*" />
          <Field label="Link (optional)">
            <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder="https://…" />
          </Field>
          <Field label="sortOrder (optional)">
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{tAdmin(lang as any, "common.cancel")}</button>
            <button type="button" onClick={save} disabled={saveLoading || !name.trim() || !logoSrc.trim()} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">{saveLoading ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}</button>
          </div>
        </div>
      </QuickEditDrawer>
    </div>
  );
}


