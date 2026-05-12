import { requireAdminUser } from "@/lib/admin/serverSession";
import { ExportNotice } from "@/components/admin/ExportNotice";
import { parseLang } from "@/lib/admin/lang";
import { PostsClient } from "@/components/admin/posts/PostsClient";

export default async function AdminPostsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (process.env.NEXT_OUTPUT === "export") return <ExportNotice />;
  await requireAdminUser();
  const lang = parseLang(typeof searchParams.lang === "string" ? searchParams.lang : undefined);
  return <PostsClient initialLang={lang} />;
}


