import Link from "next/link";
import type { NewsLocale, NewsPostCard } from "@/lib/news/types";

function formatDate(locale: NewsLocale, d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "vi-VN", { year: "numeric", month: "short", day: "2-digit" });
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
  const readMore = locale === "en" ? "Read more" : "Đọc tiếp";

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_18px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-brand">
      <Link href={href} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
        {/* Ảnh bìa + badge danh mục nổi trên ảnh */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-100" aria-hidden="true" />
          )}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" aria-hidden="true" />
          {post.category?.name ? (
            <span className="absolute left-3 top-3 rounded-full bg-emerald-600/95 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
              {post.category.name}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {dateText ? (
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="4.5" width="18" height="16" rx="2" />
                <path d="M3 9h18M8 3v3M16 3v3" strokeLinecap="round" />
              </svg>
              <time>{dateText}</time>
              {post.author ? (
                <>
                  <span className="text-slate-300">·</span>
                  <span>{post.author}</span>
                </>
              ) : null}
            </p>
          ) : null}

          <h2 className="mt-2.5 line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-800">
            {post.title}
          </h2>
          {post.excerpt ? <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p> : <span className="flex-1" />}

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            {readMore}
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
