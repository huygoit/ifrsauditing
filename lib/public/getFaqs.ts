import { prisma } from "@/lib/db";

export type PublicFaq = {
  id: number;
  sectionKey: string | null;
  question: string;
  answer: string;
  sortOrder: number;
  updatedAt: string;
};

export async function getFaqs(locale: "vi" | "en"): Promise<PublicFaq[]> {
  const lang = locale === "en" ? "en" : "vi";
  const rows = (await prisma.$queryRaw`
    SELECT
      f.id,
      f.sortOrder,
      f.sectionKey,
      f.updatedAt,
      tl.question AS question_lang,
      tl.answer AS answer_lang,
      tv.question AS question_vi,
      tv.answer AS answer_vi
    FROM faq f
    LEFT JOIN faqtranslation tl
      ON tl.faqId = f.id AND tl.lang = ${lang}
    LEFT JOIN faqtranslation tv
      ON tv.faqId = f.id AND tv.lang = 'vi'
    WHERE f.status = 'VISIBLE'
    ORDER BY f.sortOrder ASC, f.updatedAt DESC
  `) as Array<{
    id: number;
    sortOrder: number;
    sectionKey: string | null;
    updatedAt: Date;
    question_lang: string | null;
    answer_lang: string | null;
    question_vi: string | null;
    answer_vi: string | null;
  }>;

  return rows
    .map((r) => {
      const hasLocale = Boolean(r.question_lang);
      const question = (hasLocale ? r.question_lang : r.question_vi) ?? "";
      const answer = (hasLocale ? r.answer_lang : r.answer_vi) ?? "";
      if (!question || !answer) return null;
      return {
        id: Number(r.id),
        sectionKey: r.sectionKey ?? null,
        question,
        answer,
        sortOrder: Number(r.sortOrder ?? 0),
        updatedAt: new Date(r.updatedAt).toISOString()
      } satisfies PublicFaq;
    })
    .filter(Boolean) as PublicFaq[];
}

