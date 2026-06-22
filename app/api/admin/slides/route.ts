import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional(),
  q: z.string().optional(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parseLang(parsed.data.lang);
  const q = (parsed.data.q ?? "").trim();
  const status = parsed.data.status ?? "";

  const where: string[] = [];
  const params: unknown[] = [lang];
  if (status) {
    where.push("s.status = ?");
    params.push(status);
  }
  if (q) {
    where.push("(t.title LIKE ? OR vi.title LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const rows = (await prisma.$queryRawUnsafe(
    `SELECT s.id, s.image, s.link, s.status, s.sortOrder, s.createdAt, s.updatedAt,
            t.title AS t_title, t.eyebrow AS t_eyebrow, t.\`desc\` AS t_desc, t.alt AS t_alt,
            vi.title AS vi_title, vi.eyebrow AS vi_eyebrow, vi.\`desc\` AS vi_desc, vi.alt AS vi_alt
       FROM slide s
       LEFT JOIN slidetranslation t  ON t.slideId  = s.id AND t.lang  = ?
       LEFT JOIN slidetranslation vi ON vi.slideId = s.id AND vi.lang = 'vi'
       ${whereSql}
      ORDER BY s.sortOrder ASC, s.createdAt DESC`,
    ...params
  )) as any[];

  return NextResponse.json({
    items: rows.map((r) => {
      const hasLang = r.t_title != null;
      return {
        id: r.id,
        image: r.image,
        link: r.link ?? null,
        status: r.status,
        sortOrder: Number(r.sortOrder),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        translation: {
          lang: hasLang ? lang : "vi",
          eyebrow: (hasLang ? r.t_eyebrow : r.vi_eyebrow) ?? "",
          title: (hasLang ? r.t_title : r.vi_title) ?? "",
          desc: (hasLang ? r.t_desc : r.vi_desc) ?? "",
          alt: (hasLang ? r.t_alt : r.vi_alt) ?? ""
        },
        meta: { missingLang: lang === "en" ? !hasLang : false }
      };
    })
  });
}

const CreateBody = z.object({
  lang: z.enum(["vi", "en"]),
  image: z.string().min(1).max(500),
  link: z.string().max(500).optional().nullable(),
  status: z.enum(["PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  eyebrow: z.string().max(200).optional(),
  title: z.string().min(1).max(200),
  desc: z.string().max(800).optional(),
  alt: z.string().max(200).optional()
});

export async function POST(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, image, link, status, sortOrder, eyebrow, title, desc, alt } = parsed.data;

  const maxRows = (await prisma.$queryRawUnsafe(`SELECT MAX(sortOrder) AS m FROM slide`)) as Array<{ m: number | null }>;
  const nextSort = sortOrder ?? (Number(maxRows[0]?.m ?? 0) + 10);

  const slideId = randomUUID();
  const trId = randomUUID();
  await prisma.$executeRawUnsafe(
    `INSERT INTO slide (id, image, link, status, sortOrder, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    slideId,
    image,
    link ?? null,
    status,
    nextSort
  );
  await prisma.$executeRawUnsafe(
    `INSERT INTO slidetranslation (id, slideId, lang, eyebrow, title, \`desc\`, alt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    trId,
    slideId,
    lang,
    eyebrow ?? null,
    title,
    desc ?? null,
    alt ?? null
  );

  return NextResponse.json({ ok: true, id: slideId });
}
