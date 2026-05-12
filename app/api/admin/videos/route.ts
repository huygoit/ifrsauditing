import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
  type: z.enum(["YOUTUBE", "MP4"]).optional(),
  placement: z.enum(["VIDEO_PROOF", "HOW_TO_USE", "OTHER"]).optional()
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
  const placement = parsed.data.placement ?? undefined;

  const items = await prisma.video.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(placement ? { placement } : {}),
      ...(q
        ? {
            translations: {
              some: {
                OR: [{ title: { contains: q } }, { caption: { contains: q } }]
              }
            }
          }
        : {})
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: { where: { lang }, select: { title: true, caption: true } }
    }
  });

  const needsViFallback = lang === "en" && items.some((v) => v.translations.length === 0);
  const viById = needsViFallback
    ? new Map(
        (
          await prisma.videoTranslation.findMany({
            where: { videoId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { videoId: true, title: true, caption: true }
          })
        ).map((t) => [t.videoId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((v) => {
      const t = v.translations[0] ?? null;
      const vi = viById?.get(v.id) ?? null;
      return {
        id: v.id,
        type: v.type,
        src: v.src,
        thumbnailSrc: v.thumbnailSrc,
        duration: v.duration,
        placement: v.placement,
        status: v.status,
        sortOrder: v.sortOrder,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        translation: t
          ? { lang, title: t.title, caption: t.caption ?? "" }
          : vi
            ? { lang: "vi", title: vi.title, caption: vi.caption ?? "" }
            : { lang, title: "", caption: "" },
        meta: { missingLang: lang === "en" ? !t : false }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  type: z.enum(["YOUTUBE", "MP4"]).default("YOUTUBE"),
  src: z.string().min(1).max(1000),
  thumbnailSrc: z.string().min(1).max(500),
  duration: z.string().min(1).max(20),
  placement: z.enum(["VIDEO_PROOF", "HOW_TO_USE", "OTHER"]).default("VIDEO_PROOF"),
  status: z.enum(["PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  title: z.string().min(1).max(200),
  caption: z.string().max(1000).optional()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, type, src, thumbnailSrc, duration, placement, status, sortOrder, title, caption } = parsed.data;
  const max = await prisma.video.aggregate({ _max: { sortOrder: true } });
  const nextSort = sortOrder ?? ((max._max.sortOrder ?? 0) + 10);

  const created = await prisma.video.create({
    data: {
      type,
      src,
      thumbnailSrc,
      duration,
      placement,
      status,
      sortOrder: nextSort,
      translations: { create: { lang, title, caption: caption ?? null } }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, id: created.id });
}


