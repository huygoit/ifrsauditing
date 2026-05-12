import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  // `AdminShell` uses `useSearchParams` (client hook). When doing static export,
  // Next requires it to be wrapped in a suspense boundary.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Loading admin…</p>
              <p className="mt-2 text-sm text-slate-600">Preparing workspace</p>
            </div>
          </div>
        </div>
      }
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}


