import { requireAdminUser } from "@/lib/admin/serverSession";
import { ExportNotice } from "@/components/admin/ExportNotice";
import { parseLang } from "@/lib/admin/lang";
import { PartnersClient } from "@/components/admin/partners/PartnersClient";

export default async function AdminPartnersPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  const lang = parseLang(typeof searchParams.lang === "string" ? searchParams.lang : undefined);
  return <PartnersClient initialLang={lang} />;
}


