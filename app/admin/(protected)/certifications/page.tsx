import { requireAdminUser } from "@/lib/admin/serverSession";
import { parseLang } from "@/lib/admin/lang";
import { CertificationsClient } from "@/components/admin/certifications/CertificationsClient";
import { ExportNotice } from "@/components/admin/ExportNotice";

export default async function AdminCertificationsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  const lang = parseLang(typeof searchParams.lang === "string" ? searchParams.lang : undefined);
  return <CertificationsClient initialLang={lang} />;
}


