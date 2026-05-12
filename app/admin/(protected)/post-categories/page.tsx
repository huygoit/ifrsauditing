import { requireAdminUser } from "@/lib/admin/serverSession";
import { parseLang } from "@/lib/admin/lang";
import { ExportNotice } from "@/components/admin/ExportNotice";
import { PostCategoriesClient } from "@/components/admin/postCategories/PostCategoriesClient";

export default async function AdminPostCategoriesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  const lang = parseLang(typeof searchParams.lang === "string" ? searchParams.lang : undefined);
  return <PostCategoriesClient initialLang={lang} />;
}

