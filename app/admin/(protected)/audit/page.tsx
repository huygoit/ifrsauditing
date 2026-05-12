import { requireAdminUser } from "@/lib/admin/serverSession";
import { ExportNotice } from "@/components/admin/ExportNotice";
import { AuditClient } from "@/components/admin/audit/AuditClient";

export default async function AdminAuditPage() {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  return <AuditClient />;
}


