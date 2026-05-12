import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
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

  const items = await prisma.category.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            translations: {
              some: {
                OR: [
                  { name: { contains: q } },
                  { description: { contains: q } }
                ]
              }
            }
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: {
        where: { lang },
        select: { lang: true, name: true, description: true }
      }
    }
  });

  // fetch VI for fallback (cheap, only for EN mode and missing translation)
  const needsViFallback = lang === "en" && items.some((c) => c.translations.length === 0);
  const viById = needsViFallback
    ? new Map(
        (
          await prisma.categoryTranslation.findMany({
            where: { categoryId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { categoryId: true, name: true, description: true }
          })
        ).map((t) => [t.categoryId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((c) => {
      const t = c.translations[0] ?? null;
      const vi = viById?.get(c.id) ?? null;
      return {
        id: c.id,
        iconKey: c.iconKey,
        sortOrder: c.sortOrder,
        status: c.status,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        translation: t
          ? { lang, name: t.name, description: t.description ?? "" }
          : vi
            ? { lang: "vi", name: vi.name, description: vi.description ?? "" }
            : { lang: lang, name: "", description: "" },
        meta: {
          missingLang: lang === "en" ? !t : false,
          hasVi: Boolean(vi || (lang === "vi" && t))
        }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  iconKey: z.string().min(1).max(64),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  name: z.string().min(1).max(160),
  description: z.string().max(1000).optional()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, iconKey, status, sortOrder, name, description } = parsed.data;
  const max = await prisma.category.aggregate({ _max: { sortOrder: true } });
  const nextSort = sortOrder ?? ((max._max.sortOrder ?? 0) + 10);

  const created = await prisma.category.create({
    data: {
      iconKey,
      status,
      sortOrder: nextSort,
      translations: {
        create: { lang, name, description: description ?? null }
      }
    }
  });

  return NextResponse.json({ ok: true, id: created.id });
}


