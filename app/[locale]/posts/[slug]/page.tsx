import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { renderMarkdownToSafeHtml } from "@/lib/markdown";

export const runtime = "nodejs";

export default async function PostDetailPage({ params }: { params: { locale: "vi" | "en"; slug: string } }) {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "news" });

  const tr =
    (await prisma.postTranslation.findUnique({
      where: { lang_slug: { lang: locale, slug } },
      include: { post: true }
    })) ??
    (locale === "en"
      ? await prisma.postTranslation.findUnique({
          where: { lang_slug: { lang: "vi", slug } },
          include: { post: true }
        })
      : null);

  if (!tr) return notFound();
  if (tr.post.status !== "PUBLISHED") return notFound();

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
      <a href={`/${locale}/posts`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
        {t("backAll")}
      </a>

      <header className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{tr.title}</h1>
        {tr.excerpt ? <p className="mt-3 text-base leading-7 text-slate-600">{tr.excerpt}</p> : null}
        <div className="mt-4 text-xs font-semibold text-slate-500">
          {t("updatedAt")} {tr.post.updatedAt.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN")}
        </div>
      </header>

      <section className="mt-8">
        {tr.contentMarkdown ? (
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdownToSafeHtml(tr.contentMarkdown) }} />
        ) : (
          <p className="text-sm text-slate-600">{t("contentUpdating")}</p>
        )}
      </section>
    </main>
  );
}

