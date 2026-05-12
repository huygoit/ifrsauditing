import Link from "next/link";
import type { NewsLocale, NewsPostCard } from "@/lib/news/types";

function formatDate(locale: NewsLocale, d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN", { year: "numeric", month: "short", day: "2-digit" });
}

export function NewsCard({
  locale,
  post
}: {
  locale: NewsLocale;
  post: NewsPostCard;
}) {
  const href = post.category?.slug ? `/${locale}/news/${post.category.slug}/${post.slug}` : `/${locale}/news/${post.slug}`;
  const dateText = formatDate(locale, post.publishedAt ?? post.updatedAt);

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="grid gap-4">
        <div className="relative overflow-hidden rounded-xl bg-slate-100" style={{ paddingTop: "56.25%" }}>
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="grid gap-2">
          {post.category?.name ? (
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {post.category.name}
            </span>
          ) : null}

          <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900">{post.title}</h2>
          {post.excerpt ? <p className="line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p> : null}

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
            {dateText ? <span>{dateText}</span> : null}
            {dateText && post.author ? <span className="text-slate-300">·</span> : null}
            {post.author ? <span>{post.author}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

