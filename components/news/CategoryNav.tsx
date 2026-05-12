import Link from "next/link";
import type { NewsCategory, NewsLocale } from "@/lib/news/types";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function CategoryNav({
  locale,
  categories,
  activeSlug,
  allLabel,
  variant = "horizontal"
}: {
  locale: NewsLocale;
  categories: NewsCategory[];
  activeSlug: string | null;
  allLabel: string;
  variant?: "horizontal" | "vertical";
}) {
  const linkBase = "text-sm font-semibold transition";
  const activeClass = "bg-emerald-600 text-white";
  const inactiveClass = "text-slate-700 hover:bg-slate-50";

  if (variant === "vertical") {
    return (
      <nav className="mt-3" aria-label={allLabel}>
        <ul className="grid gap-1">
          <li>
            <Link
              href={`/${locale}/news`}
              className={cn(
                "block rounded-xl px-3 py-2.5",
                linkBase,
                !activeSlug ? activeClass : inactiveClass
              )}
            >
              {allLabel}
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${locale}/news/${c.slug}`}
                className={cn(
                  "block rounded-xl px-3 py-2.5",
                  linkBase,
                  activeSlug === c.slug ? activeClass : inactiveClass
                )}
                title={c.description || c.name}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <Link
          href={`/${locale}/news`}
          className={cn(
            "shrink-0 rounded-full px-4 py-2",
            linkBase,
            !activeSlug ? activeClass : inactiveClass
          )}
        >
          {allLabel}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/news/${c.slug}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2",
              linkBase,
              activeSlug === c.slug ? activeClass : inactiveClass
            )}
            title={c.description || c.name}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

