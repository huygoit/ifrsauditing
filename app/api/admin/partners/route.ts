import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  group: z.enum(["PARTNER", "DISTRIBUTOR", "CUSTOMER"]).optional()
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
  const group = parsed.data.group ?? undefined;

  const items = await prisma.partner.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(group ? { group } : {}),
      ...(q
        ? {
            translations: {
              some: {
                OR: [{ name: { contains: q } }, { shortDesc: { contains: q } }]
              }
            }
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: { where: { lang }, select: { name: true, shortDesc: true } }
    }
  });

  const needsViFallback = lang === "en" && items.some((p) => p.translations.length === 0);
  const viById = needsViFallback
    ? new Map(
        (
          await prisma.partnerTranslation.findMany({
            where: { partnerId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { partnerId: true, name: true, shortDesc: true }
          })
        ).map((t) => [t.partnerId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((p) => {
      const t = p.translations[0] ?? null;
      const vi = viById?.get(p.id) ?? null;
      return {
        id: p.id,
        logoSrc: p.logoSrc,
        link: p.link,
        group: p.group,
        status: p.status,
        sortOrder: p.sortOrder,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        translation: t
          ? { lang, name: t.name, shortDesc: t.shortDesc ?? "" }
          : vi
            ? { lang: "vi", name: vi.name, shortDesc: vi.shortDesc ?? "" }
            : { lang, name: "", shortDesc: "" },
        meta: { missingLang: lang === "en" ? !t : false, hasVi: Boolean(vi || (lang === "vi" && t)) }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  logoSrc: z.string().min(1).max(500),
  link: z.string().max(500).optional().nullable(),
  group: z.enum(["PARTNER", "DISTRIBUTOR", "CUSTOMER"]).default("PARTNER"),
  status: z.enum(["PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  name: z.string().min(1).max(200),
  shortDesc: z.string().max(800).optional()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, logoSrc, link, group, status, sortOrder, name, shortDesc } = parsed.data;
  const max = await prisma.partner.aggregate({ _max: { sortOrder: true } });
  const nextSort = sortOrder ?? ((max._max.sortOrder ?? 0) + 10);

  const created = await prisma.partner.create({
    data: {
      logoSrc,
      link: link ?? null,
      group,
      status,
      sortOrder: nextSort,
      translations: { create: { lang, name, shortDesc: shortDesc ?? null } }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, id: created.id });
}


