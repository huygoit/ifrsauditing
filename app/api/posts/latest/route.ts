import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Query = z.object({
  limit: z.coerce.number().int().min(1).max(10).optional(),
  lang: z.enum(["vi", "en"]).optional()
});

export async function GET(req: NextRequest) {
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parsed.data.lang ?? "vi";
  const limit = parsed.data.limit ?? 3;
  const now = new Date();

  const items = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      // Some admin flows may publish without setting publishedAt.
      // Treat null as "publish immediately" for frontend listing.
      OR: [{ publishedAt: null }, { publishedAt: { lte: now } }]
    },
    orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      translations: { select: { lang: true, title: true, excerpt: true, slug: true } }
    }
  });

  return NextResponse.json({
    items: items
      .map((p) => {
        const t =
          p.translations.find((x) => x.lang === lang) ??
          (lang === "en" ? p.translations.find((x) => x.lang === "vi") : null) ??
          p.translations[0];
        if (!t?.slug || !t?.title) return null;
        return {
          id: p.id,
          slug: t.slug,
          title: t.title,
          excerpt: t.excerpt ?? "",
          coverImage: p.coverImage,
          author: p.author,
          publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
          updatedAt: p.updatedAt.toISOString()
        };
      })
      .filter(Boolean)
  });
}

