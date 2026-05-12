"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { tAdmin } from "@/lib/admin/i18n";
import type { Lang } from "@prisma/client";

type Status = "NEW" | "CALLING" | "CONFIRMED" | "CANCELED";

type Row = {
  id: string;
  name: string;
  phone: string;
  address: string;
  quantity: number;
  note: string | null;
  status: Status;
  internalNote: string | null;
  createdAt: string;
  productId: string | null;
  comboId: string | null;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
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

function statusTone(s: Status) {
  if (s === "CONFIRMED") return "emerald";
  if (s === "CALLING") return "amber";
  if (s === "CANCELED") return "rose";
  return "slate";
}

export function OrdersClient() {
  const lang: Lang =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "vi";
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [nextStatus, setNextStatus] = useState<Status>("CALLING");
  const [internalNote, setInternalNote] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set("q", q.trim());
      if (statusFilter) sp.set("status", statusFilter);
      const res = await fetch(`/api/admin/orders?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setOrdersEnabled(Boolean(json.ordersEnabled));
      setItems(json.items ?? []);
      setSelected({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setEditing(row);
    setNextStatus(row?.status ?? "NEW");
    setInternalNote(row?.internalNote ?? "");
    setDrawerOpen(true);
  }

  async function save() {
    if (!editing) return;
    setSaveLoading(true);
    try {
      await fetch(`/api/admin/orders/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus, internalNote })
      });
      setDrawerOpen(false);
      await load();
    } finally {
      setSaveLoading(false);
    }
  }

  async function bulkSetStatus(status: Status) {
    if (!selectedIds.length) return;
    await fetch("/api/admin/orders/bulk", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, status })
    });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang, "admin.orders.title")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Leads/orders: status flow + tel: call + export CSV. (ordersEnabled:{" "}
              <span className={cn("font-semibold", ordersEnabled ? "text-emerald-700" : "text-rose-700")}>
                {ordersEnabled ? "ON" : "OFF"}
              </span>
              )
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/orders/export"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              {tAdmin(lang, "admin.orders.export_csv")}
            </a>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang, "common.search")}</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder="Name/phone/address…"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tAdmin(lang, "common.status")}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <option value="">All</option>
              <option value="NEW">NEW</option>
              <option value="CALLING">CALLING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">Selected: {selectedIds.length}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => bulkSetStatus("CALLING")} className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100">
                Set CALLING
              </button>
              <button type="button" onClick={() => bulkSetStatus("CONFIRMED")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                Set CONFIRMED
              </button>
              <button type="button" onClick={() => bulkSetStatus("CANCELED")} className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 shadow-sm transition hover:bg-rose-100">
                Set CANCELED
              </button>
              <button type="button" onClick={() => setSelected({})} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                Clear
              </button>
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
            {items.map((o) => (
              <div key={o.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <input type="checkbox" checked={Boolean(selected[o.id])} onChange={(e) => setSelected((p) => ({ ...p, [o.id]: e.target.checked }))} />
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(o.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{o.name}</p>
                    <Pill tone={statusTone(o.status) as any}>{o.status}</Pill>
                    <Pill>{new Date(o.createdAt).toLocaleString("vi-VN")}</Pill>
                    <Pill>SL: {o.quantity}</Pill>
                    {o.productId ? <Pill>product: {o.productId}</Pill> : null}
                    {o.comboId ? <Pill>combo: {o.comboId}</Pill> : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{o.phone}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{o.address}</p>
                  {o.note ? <p className="mt-1 line-clamp-2 text-xs text-slate-500">Note: {o.note}</p> : null}
                  {o.internalNote ? <p className="mt-1 line-clamp-2 text-xs text-slate-500">Internal: {o.internalNote}</p> : null}
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${o.phone}`}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    Call
                  </a>
                  <button type="button" onClick={() => openEdit(o.id)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Chưa có order.</div>
        )}
      </div>

      <QuickEditDrawer open={drawerOpen} title={editing ? `Order: ${editing.name}` : "Order"} subtitle={editing ? `#${editing.id}` : undefined} onClose={() => setDrawerOpen(false)}>
        {editing ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{editing.name}</p>
              <p className="mt-1">
                <a className="font-semibold text-emerald-700 hover:underline" href={`tel:${editing.phone}`}>
                  {editing.phone}
                </a>
              </p>
              <p className="mt-1">{editing.address}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(editing.createdAt).toLocaleString("vi-VN")}</p>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900">Status</span>
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <option value="NEW">NEW</option>
                <option value="CALLING">CALLING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELED">CANCELED</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-900">Internal note</span>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                placeholder="Ghi chú nội bộ…"
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={save} disabled={saveLoading} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">
                {saveLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ) : null}
      </QuickEditDrawer>
    </div>
  );
}


