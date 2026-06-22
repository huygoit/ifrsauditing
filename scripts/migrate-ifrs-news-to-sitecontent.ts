import { prisma } from "../lib/db";

const IFRS_CAT_SLUG = "ifrs";

// Đảm bảo có danh mục SiteContent loại IFRS (slug "ifrs"); trả id.
async function ensureIfrsCategory(): Promise<string> {
  const existing = await prisma.siteContentCategoryTranslation.findFirst({
    where: { slug: IFRS_CAT_SLUG },
    select: { siteContentCategoryId: true }
  });
  if (existing) {
    await prisma.$executeRaw`UPDATE sitecontentcategory SET type = 'IFRS' WHERE id = ${existing.siteContentCategoryId}`;
    return existing.siteContentCategoryId;
  }
  const cat = await prisma.siteContentCategory.create({
    data: {
      status: "ACTIVE",
      translations: {
        create: [
          { lang: "vi", name: "IFRS", slug: IFRS_CAT_SLUG },
          { lang: "en", name: "IFRS", slug: IFRS_CAT_SLUG }
        ]
      }
    },
    select: { id: true }
  });
  await prisma.$executeRaw`UPDATE sitecontentcategory SET type = 'IFRS' WHERE id = ${cat.id}`;
  return cat.id;
}

async function main() {
  // 1) Danh mục tin tức "ifrs"
  const postCatTr = await prisma.postCategoryTranslation.findFirst({
    where: { slug: "ifrs" },
    select: { postCategoryId: true }
  });
  if (!postCatTr) {
    console.log("Không tìm thấy danh mục tin tức slug 'ifrs' — không có gì để migrate.");
    return;
  }

  const posts = await prisma.post.findMany({
    where: { postCategoryId: postCatTr.postCategoryId },
    include: { translations: true },
    orderBy: { createdAt: "asc" }
  });
  console.log(`Tìm thấy ${posts.length} bài tin tức IFRS.`);
  if (!posts.length) return;

  const catId = await ensureIfrsCategory();

  let created = 0;
  let skipped = 0;
  for (const p of posts) {
    if (!p.translations.length) {
      console.log(`Bỏ qua bài ${p.id} (không có bản dịch).`);
      skipped++;
      continue;
    }

    // Đã migrate rồi? (trùng slug+lang trong sitecontenttranslation)
    const clash = await prisma.siteContentTranslation.findFirst({
      where: { OR: p.translations.map((t) => ({ lang: t.lang, slug: t.slug })) },
      select: { id: true, slug: true }
    });
    if (clash) {
      console.log(`Bỏ qua bài "${p.translations[0].title}" — slug đã tồn tại trong SiteContent (${clash.slug}).`);
      skipped++;
      continue;
    }

    const sc = await prisma.siteContent.create({
      data: {
        coverImage: p.coverImage,
        author: p.author,
        publishedAt: p.publishedAt,
        status: p.status,
        tags: p.tags ?? undefined,
        sortOrder: 0,
        siteContentCategoryId: catId,
        translations: {
          create: p.translations.map((t) => ({
            lang: t.lang,
            slug: t.slug,
            title: t.title,
            excerpt: t.excerpt,
            contentMarkdown: t.contentMarkdown,
            contentJson: t.contentJson ?? undefined,
            seoTitle: t.seoTitle,
            seoDesc: t.seoDesc
          }))
        }
      },
      select: { id: true }
    });
    await prisma.$executeRaw`UPDATE sitecontent SET type = 'IFRS' WHERE id = ${sc.id}`;
    created++;
    console.log(`Đã migrate: "${p.translations[0].title}"`);
  }

  console.log(`\nHoàn tất. Tạo mới: ${created}, bỏ qua: ${skipped}. Danh mục IFRS id=${catId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
