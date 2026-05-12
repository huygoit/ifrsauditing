import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  type: z.enum(["CERTIFICATION", "AWARD"]).optional()
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
  const type = parsed.data.type ?? undefined;

  const items = await prisma.certification.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(q
        ? {
            translations: {
              some: {
                OR: [{ title: { contains: q } }, { description: { contains: q } }, { note: { contains: q } }]
              }
            }
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: { where: { lang }, select: { title: true, description: true, note: true } }
    }
  });

  const needsViFallback = lang === "en" && items.some((c) => c.translations.length === 0);
  const viById = needsViFallback
    ? new Map(
        (
          await prisma.certificationTranslation.findMany({
            where: { certificationId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { certificationId: true, title: true, description: true, note: true }
          })
        ).map((t) => [t.certificationId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((c) => {
      const t = c.translations[0] ?? null;
      const vi = viById?.get(c.id) ?? null;
      return {
        id: c.id,
        type: c.type,
        logoSrc: c.logoSrc,
        certificateImageSrc: c.certificateImageSrc,
        issuedDate: c.issuedDate ? c.issuedDate.toISOString() : null,
        issuer: c.issuer,
        status: c.status,
        sortOrder: c.sortOrder,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        translation: t
          ? { lang, title: t.title, description: t.description ?? "", note: t.note ?? "" }
          : vi
            ? { lang: "vi", title: vi.title, description: vi.description ?? "", note: vi.note ?? "" }
            : { lang, title: "", description: "", note: "" },
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
  type: z.enum(["CERTIFICATION", "AWARD"]).default("CERTIFICATION"),
  logoSrc: z.string().min(1).max(500),
  certificateImageSrc: z.string().max(500).optional().nullable(),
  issuedDate: z.string().optional().nullable(), // YYYY-MM-DD or ISO
  issuer: z.string().max(160).optional().nullable(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  note: z.string().max(2000).optional()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, type, logoSrc, certificateImageSrc, issuedDate, issuer, status, sortOrder, title, description, note } =
    parsed.data;

  const max = await prisma.certification.aggregate({ _max: { sortOrder: true } });
  const nextSort = sortOrder ?? ((max._max.sortOrder ?? 0) + 10);
  const issued = issuedDate ? new Date(issuedDate) : null;

  const created = await prisma.certification.create({
    data: {
      type,
      logoSrc,
      certificateImageSrc: certificateImageSrc ?? null,
      issuedDate: issued && !isNaN(issued.valueOf()) ? issued : null,
      issuer: issuer ?? null,
      status,
      sortOrder: nextSort,
      translations: {
        create: {
          lang,
          title,
          description: description ?? null,
          note: note ?? null
        }
      }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, id: created.id });
}


