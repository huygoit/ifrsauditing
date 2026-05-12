import { prisma } from "@/lib/db";
import type { VideoItem } from "@/lib/trust";

export async function getVideos(locale: "vi" | "en"): Promise<VideoItem[]> {
  const lang = locale === "en" ? "en" : "vi";
  const rows = (await prisma.$queryRaw`
    SELECT
      v.id,
      v.type,
      v.src,
      v.thumbnailSrc,
      v.duration,
      v.sortOrder,
      tl.title AS title_lang,
      tv.title AS title_vi
    FROM video v
    LEFT JOIN videotranslation tl ON tl.videoId = v.id AND tl.lang = ${lang}
    LEFT JOIN videotranslation tv ON tv.videoId = v.id AND tv.lang = 'vi'
    WHERE v.status = 'PUBLISHED' AND v.placement = 'VIDEO_PROOF'
    ORDER BY v.sortOrder ASC, v.createdAt DESC
  `) as Array<any>;

  return rows
    .map((r) => {
      const hasLocale = Boolean(r.title_lang);
      const title = (hasLocale ? r.title_lang : r.title_vi) ?? "";
      if (!title) return null;
      return {
        id: String(r.id),
        title: String(title),
        type: String(r.type).toLowerCase() === "youtube" ? "youtube" : "mp4",
        src: String(r.src ?? ""),
        thumbnailSrc: String(r.thumbnailSrc ?? ""),
        duration: String(r.duration ?? "")
      } satisfies VideoItem;
    })
    .filter(Boolean) as VideoItem[];
}

