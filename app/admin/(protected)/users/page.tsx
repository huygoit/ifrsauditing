import { requireAdminUser } from "@/lib/admin/serverSession";
import { ExportNotice } from "@/components/admin/ExportNotice";
import { UsersClient } from "@/components/admin/users/UsersClient";

export default async function AdminUsersPage() {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  return <UsersClient />;
}


