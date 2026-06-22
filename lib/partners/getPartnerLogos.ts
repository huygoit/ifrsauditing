import { prisma } from "@/lib/db";

export type PartnerLogo = { id: string; src: string; name: string; link: string | null };

/**
 * Logo đối tác/khách hàng (PUBLISHED) cho trang chủ.
 * Tên lấy theo `locale`, thiếu thì fallback sang VI.
 */
export async function getPartnerLogos(locale: "vi" | "en"): Promise<PartnerLogo[]> {
  const rows = await prisma.partner.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { translations: { select: { lang: true, name: true } } }
  });

  return rows
    .filter((p) => p.logoSrc)
    .map((p) => {
      const t = p.translations.find((x) => x.lang === locale) ?? p.translations.find((x) => x.lang === "vi");
      return { id: p.id, src: p.logoSrc, name: t?.name ?? "", link: p.link ?? null };
    });
}
