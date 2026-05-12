import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  categoryId: z.string().optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parseLang(parsed.data.lang);
  const q = (parsed.data.q ?? "").trim();
  const status = parsed.data.status ?? undefined;
  const categoryId = parsed.data.categoryId ?? undefined;
  const featured =
    parsed.data.featured === "true" ? true : parsed.data.featured === "false" ? false : undefined;

  const items = await prisma.product.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(typeof featured === "boolean" ? { featured } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(q
        ? {
            OR: [
              { id: { contains: q } },
              {
                translations: {
                  some: {
                    OR: [{ name: { contains: q } }, { shortDesc: { contains: q } }]
                  }
                }
              }
            ]
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      category: {
        include: {
          translations: { where: { lang }, select: { name: true } }
        }
      },
      translations: { where: { lang }, select: { name: true, shortDesc: true } }
    }
  });

  const needsViFallback = lang === "en" && items.some((p) => p.translations.length === 0);
  const viByProductId = needsViFallback
    ? new Map(
        (
          await prisma.productTranslation.findMany({
            where: { productId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { productId: true, name: true, shortDesc: true }
          })
        ).map((t) => [t.productId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((p) => {
      const t = p.translations[0] ?? null;
      const vi = viByProductId?.get(p.id) ?? null;
      const catName = p.category.translations[0]?.name ?? p.categoryId;
      return {
        id: p.id,
        categoryId: p.categoryId,
        categoryName: catName,
        priceVnd: p.priceVnd,
        salePriceVnd: p.salePriceVnd,
        sizeTag: p.sizeTag,
        badges: Array.isArray(p.badges) ? (p.badges as any[]) : (p.badges ? [p.badges] : []),
        status: p.status,
        featured: p.featured,
        sortOrder: p.sortOrder,
        thumbnailSrc: p.thumbnailSrc,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        translation: t
          ? { lang, name: t.name, shortDesc: t.shortDesc ?? "" }
          : vi
            ? { lang: "vi", name: vi.name, shortDesc: vi.shortDesc ?? "" }
            : { lang, name: "", shortDesc: "" },
        meta: {
          missingLang: lang === "en" ? !t : false
        }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  id: z.string().min(2).max(64).optional(),
  categoryId: z.string().min(1),
  priceVnd: z.number().int().min(0).max(999999999),
  salePriceVnd: z.number().int().min(0).max(999999999).optional().nullable(),
  sizeTag: z.string().min(1).max(80),
  badges: z.array(z.string().min(1).max(40)).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  thumbnailSrc: z.string().min(1).max(500),
  // translation fields
  name: z.string().min(1).max(160),
  shortDesc: z.string().max(400).optional(),
  descriptionJson: z.record(z.any()).nullable().optional(),
  descriptionMarkdown: z.string().max(50000).optional().nullable()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const {
    lang,
    id,
    categoryId,
    priceVnd,
    salePriceVnd,
    sizeTag,
    badges,
    status,
    featured,
    sortOrder,
    thumbnailSrc,
    name,
    shortDesc,
    descriptionJson,
    descriptionMarkdown
  } = parsed.data;

  const max = await prisma.product.aggregate({ _max: { sortOrder: true } });
  const nextSort = sortOrder ?? ((max._max.sortOrder ?? 0) + 10);

  const created = await prisma.product.create({
    data: {
      ...(id ? { id } : {}),
      categoryId,
      priceVnd,
      salePriceVnd: salePriceVnd ?? null,
      sizeTag,
      badges: badges ?? [],
      status,
      featured: featured ?? false,
      sortOrder: nextSort,
      thumbnailSrc,
      translations: {
        create: {
          lang,
          name,
          shortDesc: shortDesc ?? null,
          descriptionJson: descriptionJson === null || descriptionJson === undefined ? Prisma.JsonNull : descriptionJson,
          descriptionMarkdown: descriptionMarkdown ?? null
        }
      }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, id: created.id });
}


