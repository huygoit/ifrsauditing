import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"]).optional()
});

function isSuspicious(content: string) {
  const c = content.toLowerCase();
  if (c.includes("http://") || c.includes("https://")) return true;
  if (c.includes("zalo") && c.includes("giá rẻ")) return true;
  if (c.split(" ").length < 3) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parseLang(parsed.data.lang);
  const q = (parsed.data.q ?? "").trim();
  const status = parsed.data.status ?? undefined;

  const items = await prisma.review.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            translations: {
              some: { OR: [{ name: { contains: q } }, { content: { contains: q } }] }
            }
          }
        : {})
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      translations: { where: { lang }, select: { name: true, content: true } }
    }
  });

  const needsViFallback = lang === "en" && items.some((r) => r.translations.length === 0);
  const viById = needsViFallback
    ? new Map(
        (
          await prisma.reviewTranslation.findMany({
            where: { reviewId: { in: items.map((x) => x.id) }, lang: "vi" },
            select: { reviewId: true, name: true, content: true }
          })
        ).map((t) => [t.reviewId, t])
      )
    : null;

  return NextResponse.json({
    items: items.map((r) => {
      const t = r.translations[0] ?? null;
      const vi = viById?.get(r.id) ?? null;
      const content = t?.content ?? vi?.content ?? "";
      const imgs = Array.isArray(r.images) ? (r.images as any[]) : r.images ? [r.images] : [];
      return {
        id: r.id,
        rating: r.rating,
        avatar: r.avatar,
        location: r.location,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        images: imgs,
        translation: t
          ? { lang, name: t.name, content: t.content }
          : vi
            ? { lang: "vi", name: vi.name, content: vi.content }
            : { lang, name: "", content: "" },
        meta: {
          missingLang: lang === "en" ? !t : false,
          suspicious: isSuspicious(content)
        }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  rating: z.number().int().min(1).max(5),
  location: z.string().max(120).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  images: z.array(z.string().min(1).max(500)).optional(),
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"]).default("PENDING"),
  name: z.string().min(1).max(120),
  content: z.string().min(1).max(2000)
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, rating, location, avatar, images, status, name, content } = parsed.data;
  const created = await prisma.review.create({
    data: {
      rating,
      location: location ?? null,
      avatar: avatar ?? null,
      images: images ?? [],
      status,
      translations: { create: { lang, name, content } }
    },
    select: { id: true }
  });
  return NextResponse.json({ ok: true, id: created.id });
}


