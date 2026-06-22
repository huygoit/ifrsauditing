import { prisma } from "@/lib/db";

export type HeroSlide = {
  id: string;
  image: string;
  link: string | null;
  eyebrow: string;
  title: string;
  desc: string;
  alt: string;
};

/**
 * Slide Hero (PUBLISHED) cho trang chủ, sắp theo sortOrder.
 * Nội dung lấy theo `locale`, thiếu thì fallback sang VI.
 * Dùng raw SQL để không phụ thuộc Prisma client mới (tránh khóa file khi dev server đang chạy).
 */
export async function getSlides(locale: "vi" | "en"): Promise<HeroSlide[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT s.id, s.image, s.link,
            COALESCE(t.eyebrow, vi.eyebrow) AS eyebrow,
            COALESCE(t.title, vi.title)     AS title,
            COALESCE(t.\`desc\`, vi.\`desc\`) AS \`desc\`,
            COALESCE(t.alt, vi.alt)         AS alt
       FROM slide s
       LEFT JOIN slidetranslation t  ON t.slideId  = s.id AND t.lang  = ?
       LEFT JOIN slidetranslation vi ON vi.slideId = s.id AND vi.lang = 'vi'
      WHERE s.status = 'PUBLISHED'
      ORDER BY s.sortOrder ASC, s.createdAt ASC`,
    locale
  )) as Array<{ id: string; image: string; link: string | null; eyebrow: string | null; title: string | null; desc: string | null; alt: string | null }>;

  return rows.map((r) => ({
    id: r.id,
    image: r.image,
    link: r.link ?? null,
    eyebrow: r.eyebrow ?? "",
    title: r.title ?? "",
    desc: r.desc ?? "",
    alt: r.alt ?? r.title ?? ""
  }));
}
