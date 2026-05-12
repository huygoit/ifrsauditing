"use client";

import { useEffect, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";

type AuditRow = {
  id: string;
  entity: string;
  entityId: string | null;
  action: string;
  summary: string;
  diffJson: any;
  createdAt: string;
  actor: { id: string; username: string; role: string };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "emerald" | "slate" | "amber" }) {
  const cls =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold", cls)}>{children}</span>;
}

export function AuditClient() {
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AuditRow[]>([]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AuditRow | null>(null);

  async function load() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set("q", q.trim());
      if (entity.trim()) sp.set("entity", entity.trim());
      const res = await fetch(`/api/admin/audit?${sp.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setItems(json.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openRow(row: AuditRow) {
    setSelected(row);
    setOpen(true);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Audit</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Audit log (read-only): ai sửa gì, entity, timestamp, diff summary.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder="actor / entityId / action / summary…"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Entity</span>
            <input
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              placeholder="Product / Order…"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="grid gap-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => openRow(a)}
                className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{a.summary}</p>
                  <Pill>{a.entity}</Pill>
                  {a.entityId ? <Pill>{a.entityId}</Pill> : null}
                  <Pill tone="amber">{a.action}</Pill>
                  <Pill>{a.actor.username}</Pill>
                  <Pill>{new Date(a.createdAt).toLocaleString("vi-VN")}</Pill>
                </div>
                <p className="truncate text-xs text-slate-600">{a.id}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Chưa có audit logs.</div>
        )}
      </div>

      <QuickEditDrawer
        open={open}
        title={selected ? `${selected.entity} • ${selected.action}` : "Audit detail"}
        subtitle={selected ? `${selected.actor.username} • ${new Date(selected.createdAt).toLocaleString("vi-VN")}` : undefined}
        onClose={() => setOpen(false)}
      >
        {selected ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Summary</p>
              <p className="mt-2 font-semibold text-slate-900">{selected.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Pill>{selected.entity}</Pill>
                {selected.entityId ? <Pill>{selected.entityId}</Pill> : null}
                <Pill tone="amber">{selected.action}</Pill>
                <Pill>{selected.actor.username}</Pill>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Diff JSON</p>
              <pre className="mt-3 max-h-[60vh] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                {JSON.stringify(selected.diffJson ?? null, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}
      </QuickEditDrawer>
    </div>
  );
}


