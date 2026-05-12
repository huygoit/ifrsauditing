import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

function csvEscape(s: unknown) {
  const v = String(s ?? "");
  if (v.includes('"') || v.includes(",") || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const items = await prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      status: true,
      name: true,
      phone: true,
      address: true,
      quantity: true,
      note: true,
      internalNote: true,
      productId: true,
      comboId: true
    }
  });

  const header = ["id", "createdAt", "status", "name", "phone", "address", "quantity", "productId", "comboId", "note", "internalNote"];
  const rows = items.map((o) => [
    o.id,
    o.createdAt.toISOString(),
    o.status,
    o.name,
    o.phone,
    o.address,
    o.quantity,
    o.productId ?? "",
    o.comboId ?? "",
    o.note ?? "",
    o.internalNote ?? ""
  ]);

  const csv = [header.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="enso-orders.csv"'
    }
  });
}


