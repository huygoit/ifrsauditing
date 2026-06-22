import { prisma } from "../lib/db";

/**
 * Seed danh mục IFRS + một số bài viết chuyên đề IFRS (vi + en).
 * Chạy được nhiều lần: đã tồn tại (theo slug) thì bỏ qua, không tạo trùng.
 */

type PostSeed = {
  cover: string;
  author: string;
  vi: { slug: string; title: string; excerpt: string; content: string };
  en: { slug: string; title: string; excerpt: string; content: string };
};

const CATEGORY = {
  vi: { slug: "ifrs", name: "IFRS", description: "Chuẩn mực Báo cáo Tài chính Quốc tế — kiến thức, lộ trình và giải pháp chuyển đổi cho doanh nghiệp Việt Nam." },
  en: { slug: "ifrs", name: "IFRS", description: "International Financial Reporting Standards — knowledge, roadmap and conversion solutions for Vietnamese enterprises." }
};

const POSTS: PostSeed[] = [
  {
    cover: "/images/news/1.jpg",
    author: "IFRS Auditing",
    vi: {
      slug: "ifrs-la-gi",
      title: "IFRS là gì? Tổng quan Chuẩn mực Báo cáo Tài chính Quốc tế",
      excerpt: "IFRS là bộ chuẩn mực kế toán quốc tế giúp báo cáo tài chính minh bạch, so sánh được trên phạm vi toàn cầu.",
      content:
        "## IFRS là gì?\n\nIFRS (International Financial Reporting Standards) là bộ Chuẩn mực Báo cáo Tài chính Quốc tế do IASB ban hành, nhằm thống nhất cách lập và trình bày báo cáo tài chính giữa các quốc gia.\n\n## Vì sao quan trọng?\n\n- Tăng tính minh bạch và khả năng so sánh của báo cáo tài chính.\n- Giúp doanh nghiệp tiếp cận vốn quốc tế dễ dàng hơn.\n- Là yêu cầu bắt buộc khi niêm yết tại nhiều thị trường nước ngoài.\n\nIFRS Auditing đồng hành cùng doanh nghiệp trong quá trình tìm hiểu và áp dụng IFRS."
    },
    en: {
      slug: "what-is-ifrs",
      title: "What is IFRS? An overview of International Financial Reporting Standards",
      excerpt: "IFRS is a set of global accounting standards that make financial statements transparent and comparable worldwide.",
      content:
        "## What is IFRS?\n\nIFRS (International Financial Reporting Standards) is a set of standards issued by the IASB to unify how financial statements are prepared and presented across countries.\n\n## Why it matters\n\n- Improves transparency and comparability of financial statements.\n- Helps businesses access international capital more easily.\n- Mandatory for listing on many foreign markets.\n\nIFRS Auditing supports enterprises throughout their IFRS journey."
    }
  },
  {
    cover: "/images/news/2.jpg",
    author: "IFRS Auditing",
    vi: {
      slug: "khac-biet-vas-va-ifrs",
      title: "Khác biệt giữa VAS và IFRS doanh nghiệp cần biết",
      excerpt: "So sánh những điểm khác biệt cốt lõi giữa Chuẩn mực kế toán Việt Nam (VAS) và IFRS.",
      content:
        "## VAS và IFRS khác nhau thế nào?\n\nVAS được xây dựng dựa trên IFRS phiên bản cũ nhưng có nhiều khác biệt về nguyên tắc ghi nhận, đo lường và trình bày.\n\n## Một số khác biệt chính\n\n- **Giá trị hợp lý:** IFRS sử dụng rộng rãi giá trị hợp lý, VAS thiên về giá gốc.\n- **Suy giảm giá trị tài sản:** IFRS yêu cầu đánh giá định kỳ, VAS hạn chế.\n- **Trình bày báo cáo:** IFRS yêu cầu thuyết minh chi tiết hơn.\n\nViệc hiểu rõ khác biệt giúp doanh nghiệp chuẩn bị tốt cho quá trình chuyển đổi."
    },
    en: {
      slug: "difference-between-vas-and-ifrs",
      title: "Key differences between VAS and IFRS businesses should know",
      excerpt: "A comparison of the core differences between Vietnamese Accounting Standards (VAS) and IFRS.",
      content:
        "## How do VAS and IFRS differ?\n\nVAS was built on older IFRS versions but differs significantly in recognition, measurement and presentation principles.\n\n## Some key differences\n\n- **Fair value:** IFRS widely uses fair value; VAS favors historical cost.\n- **Impairment:** IFRS requires periodic assessment; VAS is limited.\n- **Presentation:** IFRS requires more detailed disclosures.\n\nUnderstanding these differences helps enterprises prepare for conversion."
    }
  },
  {
    cover: "/images/blog/1.jpg",
    author: "IFRS Auditing",
    vi: {
      slug: "lo-trinh-ap-dung-ifrs-tai-viet-nam",
      title: "Lộ trình áp dụng IFRS tại Việt Nam",
      excerpt: "Bộ Tài chính đã công bố lộ trình áp dụng IFRS theo từng giai đoạn cho doanh nghiệp Việt Nam.",
      content:
        "## Lộ trình áp dụng IFRS\n\nTheo Quyết định 345/QĐ-BTC, lộ trình áp dụng IFRS tại Việt Nam chia làm các giai đoạn:\n\n- **Giai đoạn chuẩn bị (2020–2021):** xây dựng khuôn khổ, đào tạo.\n- **Giai đoạn áp dụng tự nguyện (2022–2025):** doanh nghiệp đủ điều kiện tự nguyện áp dụng.\n- **Giai đoạn bắt buộc (sau 2025):** áp dụng bắt buộc với nhóm doanh nghiệp theo quy định.\n\nDoanh nghiệp nên chuẩn bị sớm về nhân sự, hệ thống và dữ liệu."
    },
    en: {
      slug: "ifrs-adoption-roadmap-in-vietnam",
      title: "IFRS adoption roadmap in Vietnam",
      excerpt: "The Ministry of Finance has announced a phased roadmap for IFRS adoption by Vietnamese enterprises.",
      content:
        "## IFRS adoption roadmap\n\nUnder Decision 345/QD-BTC, Vietnam's IFRS roadmap is split into phases:\n\n- **Preparation (2020–2021):** building the framework and training.\n- **Voluntary adoption (2022–2025):** eligible enterprises may adopt voluntarily.\n- **Mandatory phase (after 2025):** mandatory for certain enterprise groups.\n\nBusinesses should prepare early in terms of people, systems and data."
    }
  },
  {
    cover: "/images/blog/2.jpg",
    author: "IFRS Auditing",
    vi: {
      slug: "cac-chuan-muc-ifrs-quan-trong",
      title: "Các chuẩn mực IFRS quan trọng doanh nghiệp cần nắm",
      excerpt: "Tổng hợp những chuẩn mực IFRS phổ biến và có ảnh hưởng lớn đến báo cáo tài chính.",
      content:
        "## Những chuẩn mực IFRS quan trọng\n\n- **IFRS 9 – Công cụ tài chính:** ghi nhận và đo lường tài sản, nợ tài chính.\n- **IFRS 15 – Doanh thu từ hợp đồng với khách hàng.**\n- **IFRS 16 – Thuê tài sản:** đưa phần lớn hợp đồng thuê lên bảng cân đối.\n- **IAS 36 – Suy giảm giá trị tài sản.**\n\nMỗi chuẩn mực có phạm vi và yêu cầu riêng, cần đánh giá tác động cụ thể."
    },
    en: {
      slug: "key-ifrs-standards",
      title: "Key IFRS standards businesses should understand",
      excerpt: "A roundup of the most common and impactful IFRS standards for financial reporting.",
      content:
        "## Important IFRS standards\n\n- **IFRS 9 – Financial instruments:** recognition and measurement of financial assets and liabilities.\n- **IFRS 15 – Revenue from contracts with customers.**\n- **IFRS 16 – Leases:** brings most leases onto the balance sheet.\n- **IAS 36 – Impairment of assets.**\n\nEach standard has its own scope and requirements requiring specific impact assessment."
    }
  },
  {
    cover: "/images/blog/3.jpg",
    author: "IFRS Auditing",
    vi: {
      slug: "ifrs-18-trinh-bay-thuyet-minh-bctc",
      title: "IFRS 18 – Trình bày và thuyết minh báo cáo tài chính",
      excerpt: "IFRS 18 thay thế IAS 1, thay đổi cách trình bày báo cáo kết quả hoạt động kinh doanh.",
      content:
        "## IFRS 18 là gì?\n\nIFRS 18 là chuẩn mực mới về trình bày và thuyết minh báo cáo tài chính, thay thế IAS 1, có hiệu lực từ năm 2027.\n\n## Điểm nổi bật\n\n- Phân loại thu nhập và chi phí theo các nhóm rõ ràng hơn.\n- Yêu cầu trình bày các chỉ tiêu hiệu quả do ban điều hành định nghĩa.\n- Tăng tính minh bạch và khả năng so sánh.\n\nDoanh nghiệp cần rà soát hệ thống báo cáo để đáp ứng yêu cầu mới."
    },
    en: {
      slug: "ifrs-18-presentation-and-disclosure",
      title: "IFRS 18 – Presentation and disclosure in financial statements",
      excerpt: "IFRS 18 replaces IAS 1 and changes how the statement of financial performance is presented.",
      content:
        "## What is IFRS 18?\n\nIFRS 18 is a new standard on presentation and disclosure of financial statements, replacing IAS 1, effective from 2027.\n\n## Highlights\n\n- Clearer classification of income and expenses into defined categories.\n- Requires disclosure of management-defined performance measures.\n- Improves transparency and comparability.\n\nBusinesses should review their reporting systems to meet the new requirements."
    }
  }
];

async function ensureCategory(): Promise<string> {
  const existing = await prisma.postCategoryTranslation.findFirst({
    where: { lang: "vi", slug: CATEGORY.vi.slug }
  });
  if (existing) {
    console.log("IFRS category already exists:", existing.postCategoryId);
    return existing.postCategoryId;
  }

  const created = await prisma.postCategory.create({
    data: {
      status: "ACTIVE",
      sortOrder: 0,
      translations: {
        create: [
          { lang: "vi", slug: CATEGORY.vi.slug, name: CATEGORY.vi.name, description: CATEGORY.vi.description },
          { lang: "en", slug: CATEGORY.en.slug, name: CATEGORY.en.name, description: CATEGORY.en.description }
        ]
      }
    }
  });
  console.log("Created IFRS category:", created.id);
  return created.id;
}

async function ensurePost(categoryId: string, seed: PostSeed, index: number) {
  const existing = await prisma.postTranslation.findFirst({
    where: { lang: "vi", slug: seed.vi.slug }
  });
  if (existing) {
    console.log("Post already exists, skip:", seed.vi.slug);
    return;
  }

  const created = await prisma.post.create({
    data: {
      coverImage: seed.cover,
      author: seed.author,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - index * 86400000),
      postCategoryId: categoryId,
      sortOrder: index,
      translations: {
        create: [
          {
            lang: "vi",
            slug: seed.vi.slug,
            title: seed.vi.title,
            excerpt: seed.vi.excerpt,
            contentMarkdown: seed.vi.content,
            seoTitle: seed.vi.title,
            seoDesc: seed.vi.excerpt
          },
          {
            lang: "en",
            slug: seed.en.slug,
            title: seed.en.title,
            excerpt: seed.en.excerpt,
            contentMarkdown: seed.en.content,
            seoTitle: seed.en.title,
            seoDesc: seed.en.excerpt
          }
        ]
      }
    }
  });
  console.log("Created post:", seed.vi.slug, created.id);
}

async function main() {
  const categoryId = await ensureCategory();
  for (let i = 0; i < POSTS.length; i++) {
    await ensurePost(categoryId, POSTS[i], i);
  }
  console.log("DONE seeding IFRS.");
}

main()
  .catch((e) => {
    console.error("SEED ERROR:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(process.exitCode ?? 0);
  });
