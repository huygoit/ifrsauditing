import { tAdmin } from "@/lib/admin/i18n";

export function ExportNotice() {
  const lang =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "vi";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{tAdmin(lang as any, "common.required_server")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Admin panel không chạy trong chế độ static export. Hãy chạy{" "}
        <span className="font-semibold">npm run dev</span> (không set{" "}
        <span className="font-semibold">NEXT_OUTPUT=export</span>) để dùng Admin.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="/admin/login"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Đi tới /admin/login
        </a>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
        >
          Về landing
        </a>
      </div>
    </div>
  );
}


