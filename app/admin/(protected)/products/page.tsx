import { requireAdminUser } from "@/lib/admin/serverSession";
import { parseLang } from "@/lib/admin/lang";
import { ProductsClient } from "@/components/admin/products/ProductsClient";
import { ExportNotice } from "@/components/admin/ExportNotice";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  const lang = parseLang(typeof searchParams.lang === "string" ? searchParams.lang : undefined);
  return <ProductsClient initialLang={lang} />;
}


