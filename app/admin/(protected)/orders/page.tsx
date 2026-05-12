import { requireAdminUser } from "@/lib/admin/serverSession";
import { ExportNotice } from "@/components/admin/ExportNotice";
import { OrdersClient } from "@/components/admin/orders/OrdersClient";

export default async function AdminOrdersPage() {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  return <OrdersClient />;
}


