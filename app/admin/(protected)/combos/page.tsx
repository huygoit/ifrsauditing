import { requireAdminUser } from "@/lib/admin/serverSession";
import { PageShell } from "@/components/admin/PageShell";
import { ExportNotice } from "@/components/admin/ExportNotice";

export default async function AdminCombosPage() {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  return (
    <PageShell title="Combos" subtitle="Quản lý combo/pricing + combo items (many-to-many) + translations.">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Coming soon.</p>
      </div>
    </PageShell>
  );
}


