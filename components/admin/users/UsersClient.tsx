"use client";

import { useEffect, useMemo, useState } from "react";
import { QuickEditDrawer } from "@/components/admin/QuickEditDrawer";
import { tAdmin } from "@/lib/admin/i18n";
import type { Lang } from "@prisma/client";

type Role = "ADMIN" | "EDITOR" | "CSKH";

type Row = {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
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

function roleTone(r: Role) {
  if (r === "ADMIN") return "emerald";
  if (r === "CSKH") return "amber";
  return "slate";
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

export function UsersClient() {
  const lang: Lang =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "vi";
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | Role>("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [editing, setEditing] = useState<Row | null>(null);

  // form
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("EDITOR");
  const [password, setPassword] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (q.trim()) sp.set("q", q.trim());
      if (roleFilter) sp.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${sp.toString()}`, { cache: "no-store" });
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
  }, [roleFilter]);

  useEffect(() => {
    const t = window.setTimeout(() => load(), 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setUsername("");
    setRole("EDITOR");
    setPassword("");
    setSaveError(null);
    setDrawerOpen(true);
  }

  function openEdit(id: string) {
    const row = items.find((x) => x.id === id) ?? null;
    setMode("edit");
    setEditing(row);
    setUsername(row?.username ?? "");
    setRole(row?.role ?? "EDITOR");
    setPassword("");
    setSaveError(null);
    setDrawerOpen(true);
  }

  async function save() {
    setSaveLoading(true);
    setSaveError(null);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, role, password })
        });
        if (res.status === 409) throw new Error("username_taken");
        if (!res.ok) throw new Error("save_failed");
      } else {
        const payload: any = { role };
        if (password.trim()) payload.password = password.trim();
        const res = await fetch(`/api/admin/users/${editing?.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("save_failed");
      }
      setDrawerOpen(false);
      await load();
    } catch (e: any) {
      setSaveError(e?.message === "username_taken" ? "Username đã tồn tại." : "Không lưu được. Thử lại.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function bulkRole(next: Role) {
    if (!selectedIds.length) return;
    await fetch("/api/admin/users/bulk", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, role: next })
    });
    await load();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{tAdmin(lang, "admin.users.subtitle")}</p>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            + {tAdmin(lang, "common.add_user")}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder="username…" />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</span>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="">All</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="CSKH">CSKH</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {selectedIds.length ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">Selected: {selectedIds.length}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => bulkRole("ADMIN")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">Set ADMIN</button>
              <button type="button" onClick={() => bulkRole("EDITOR")} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Set EDITOR</button>
              <button type="button" onClick={() => bulkRole("CSKH")} className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100">Set CSKH</button>
              <button type="button" onClick={() => setSelected({})} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">Clear</button>
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
            {items.map((u) => (
              <div key={u.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
                <input type="checkbox" checked={Boolean(selected[u.id])} onChange={(e) => setSelected((p) => ({ ...p, [u.id]: e.target.checked }))} />
                <button type="button" className="min-w-0 text-left" onClick={() => openEdit(u.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{u.username}</p>
                    <Pill tone={roleTone(u.role) as any}>{u.role}</Pill>
                    <Pill>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</Pill>
                  </div>
                </button>
                <button type="button" onClick={() => openEdit(u.id)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                  Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Chưa có user.</div>
        )}
      </div>

      <QuickEditDrawer open={drawerOpen} title={mode === "create" ? "Create user" : editing ? `Edit: ${editing.username}` : "Edit user"} onClose={() => setDrawerOpen(false)}>
        <div className="grid gap-4">
          <Field label="Username" hint={mode === "edit" ? "Readonly" : undefined}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} disabled={mode === "edit"} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition disabled:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>
          <Field label="Role">
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="CSKH">CSKH</option>
            </select>
          </Field>
          <Field label={mode === "create" ? "Password" : "Reset password (optional)"} hint={mode === "edit" ? "Để trống nếu không đổi." : "Min 8 chars"}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
          </Field>

          {saveError ? <p className="text-sm font-semibold text-rose-700">{saveError}</p> : null}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Cancel</button>
            <button type="button" onClick={save} disabled={saveLoading || !username.trim() || (mode === "create" && password.trim().length < 8)} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">
              {saveLoading ? tAdmin(lang, "common.loading") : tAdmin(lang, "common.save")}
            </button>
          </div>
        </div>
      </QuickEditDrawer>
    </div>
  );
}


