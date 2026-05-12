import type { NewsLocale, NewsPostCard } from "@/lib/news/types";
import { NewsCard } from "@/components/news/NewsCard";

export function RelatedPosts({
  locale,
  title,
  posts
}: {
  locale: NewsLocale;
  title: string;
  posts: NewsPostCard[];
}) {
  if (!posts.length) return null;
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <NewsCard key={p.id} locale={locale} post={p} />
        ))}
      </div>
    </section>
  );
}

