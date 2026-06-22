import { randomUUID } from "node:crypto";
import { prisma } from "../lib/db";

// 3 slide Hero cũ (nội dung lấy từ messages ifrs.hero.slides). Idempotent theo `image`.
const SLIDES = [
  {
    image: "/slides/img01.jpg",
    vi: {
      eyebrow: "Về chúng tôi",
      title: "Đối tác kiểm toán độc lập cho báo cáo minh bạch",
      desc: "Đội ngũ IFRS Auditing đồng hành cùng doanh nghiệp trong kiểm toán, kế toán và tư vấn tuân thủ với cách làm rõ ràng, chuyên nghiệp.",
      alt: "Không gian giới thiệu Công ty TNHH Kiểm toán IFRS"
    },
    en: {
      eyebrow: "About us",
      title: "An independent audit partner for transparent reporting",
      desc: "IFRS Auditing works with businesses across audit, accounting and compliance advisory with a clear and professional engagement approach.",
      alt: "Introductory visual for IFRS Auditing Company Limited"
    }
  },
  {
    image: "/slides/img02.jpg",
    vi: {
      eyebrow: "Dịch vụ",
      title: "Giải pháp kiểm toán, thuế, kế toán và tư vấn trọn mạch",
      desc: "Từ báo cáo tài chính, tư vấn thuế, thẩm định giá đến IFRS/VAS, dịch vụ được cấu trúc để doanh nghiệp dễ kiểm soát và ra quyết định.",
      alt: "Hình ảnh minh họa dịch vụ chuyên môn của IFRS Auditing"
    },
    en: {
      eyebrow: "Services",
      title: "Audit, tax, accounting and advisory in one structured service suite",
      desc: "From financial statements, tax advisory, valuation to IFRS/VAS, our services help businesses keep control and make better decisions.",
      alt: "Visual representing IFRS Auditing professional services"
    }
  },
  {
    image: "/slides/img03.jpg",
    vi: {
      eyebrow: "Tuyển dụng",
      title: "Môi trường chuyên môn cho nhân sự kiểm toán phát triển",
      desc: "IFRS Auditing xây dựng đội ngũ qua đào tạo thực tiễn, chia sẻ kinh nghiệm và cơ hội tham gia các dự án tài chính chuyên sâu.",
      alt: "Hình ảnh minh họa tuyển dụng và đào tạo tại IFRS Auditing"
    },
    en: {
      eyebrow: "Careers",
      title: "A technical environment for audit professionals to grow",
      desc: "IFRS Auditing develops its team through practical training, shared experience and opportunities to work on specialised finance projects.",
      alt: "Visual representing recruitment and training at IFRS Auditing"
    }
  }
];

async function main() {
  let created = 0;
  let skipped = 0;
  for (let i = 0; i < SLIDES.length; i++) {
    const s = SLIDES[i];

    const existing = (await prisma.$queryRawUnsafe(`SELECT id FROM slide WHERE image = ?`, s.image)) as any[];
    if (existing.length) {
      console.log(`Bỏ qua (đã có): ${s.image}`);
      skipped++;
      continue;
    }

    const slideId = randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO slide (id, image, link, status, sortOrder, createdAt, updatedAt)
       VALUES (?, ?, NULL, 'PUBLISHED', ?, NOW(3), NOW(3))`,
      slideId,
      s.image,
      (i + 1) * 10
    );
    for (const lang of ["vi", "en"] as const) {
      const tr = s[lang];
      await prisma.$executeRawUnsafe(
        `INSERT INTO slidetranslation (id, slideId, lang, eyebrow, title, \`desc\`, alt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        randomUUID(),
        slideId,
        lang,
        tr.eyebrow,
        tr.title,
        tr.desc,
        tr.alt
      );
    }
    created++;
    console.log(`Đã tạo slide: ${s.image}`);
  }
  console.log(`\nHoàn tất. Tạo mới: ${created}, bỏ qua: ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
