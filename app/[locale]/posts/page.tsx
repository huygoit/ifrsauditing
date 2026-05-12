import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export const runtime = "nodejs";

export default async function PostsPage({ params }: { params: { locale: "vi" | "en" } }) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "news" });

  const now = new Date();
  const items = await prisma.post.findMany({
    where: { status: "PUBLISHED", OR: [{ publishedAt: null }, { publishedAt: { lte: now } }] },
    orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    include: { translations: { where: { lang: locale }, select: { slug: true, title: true, excerpt: true } } }
  });

  const posts = items
    .map((p) => {
      const tr = p.translations[0];
      if (!tr?.slug || !tr?.title) return null;
      return {
        id: p.id,
        slug: tr.slug,
        title: tr.title,
        excerpt: tr.excerpt ?? "",
        updatedAt: p.updatedAt
      };
    })
    .filter(Boolean) as Array<{ id: string; slug: string; title: string; excerpt: string; updatedAt: Date }>;

  return (
    <main className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
          <p className="mt-2 text-sm text-slate-600">{t("subtitle")}</p>
        </div>
        <a href={`/${locale}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
          {t("backHome")}
        </a>
      </div>

      <div className="mt-6 grid gap-3">
        {posts.length ? (
          posts.map((p) => (
            <a
              key={p.id}
              href={`/${locale}/posts/${p.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-slate-900">{p.title}</p>
              {p.excerpt ? <p className="mt-2 text-sm leading-7 text-slate-600">{p.excerpt}</p> : null}
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {t("updatedAt")} {p.updatedAt.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN")}
              </p>
            </a>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">{t("empty")}</div>
        )}
      </div>
    </main>
  );
}

