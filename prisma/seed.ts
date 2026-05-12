import { PrismaClient, Lang, Role, Status, VideoPlacement, VideoType, CertificationType, PartnerGroup, ReviewStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash, role: Role.ADMIN },
    create: { username: "admin", passwordHash, role: Role.ADMIN }
  });

  // Settings (single record)
  await prisma.setting.upsert({
    where: { id: "default" },
    update: {
      hotline: "0852795939",
      zaloUrl: "https://zalo.me/0852795939",
      address: "TP.HCM",
      ordersEnabled: true,
      socialLinks: {
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
        zaloOA: "https://zalo.me/0852795939"
      }
    },
    create: {
      id: "default",
      hotline: "0852795939",
      zaloUrl: "https://zalo.me/0852795939",
      address: "TP.HCM",
      ordersEnabled: true,
      socialLinks: {
        facebook: "https://facebook.com",
        youtube: "https://youtube.com",
        zaloOA: "https://zalo.me/0852795939"
      },
      translations: {
        createMany: {
          data: [
            { lang: Lang.vi, topBarMessage: "COD • Giao nhanh • Đổi trả • Tư vấn" },
            { lang: Lang.en, topBarMessage: "COD • Fast shipping • Returns • Support" }
          ]
        }
      }
    }
  });

  // Categories (Use cases)
  const catShoe = await prisma.category.upsert({
    where: { id: "cat-shoe" },
    update: {},
    create: {
      id: "cat-shoe",
      iconKey: "Footprints",
      sortOrder: 10,
      status: Status.ACTIVE,
      translations: {
        createMany: {
          data: [
            { lang: Lang.vi, name: "Tủ giày", description: "Giảm mùi ẩm mốc, giữ góc giày sạch cảm giác." },
            { lang: Lang.en, name: "Shoe cabinet", description: "Reduces musty odor and keeps shoes feeling fresh." }
          ]
        }
      }
    }
  });

  const catCar = await prisma.category.upsert({
    where: { id: "cat-car" },
    update: {},
    create: {
      id: "cat-car",
      iconKey: "Car",
      sortOrder: 20,
      status: Status.ACTIVE,
      translations: {
        createMany: {
          data: [
            { lang: Lang.vi, name: "Xe hơi", description: "Dễ chịu khi di chuyển, gọn gàng trong cabin." }
            // EN intentionally missing to demonstrate fallback
          ]
        }
      }
    }
  });

  // Products
  const p1 = await prisma.product.upsert({
    where: { id: "p-enso-shoe-mini" },
    update: {},
    create: {
      id: "p-enso-shoe-mini",
      categoryId: catShoe.id,
      priceVnd: 69000,
      salePriceVnd: null,
      sizeTag: "Gói 50g",
      badges: ["Best seller"],
      status: Status.ACTIVE,
      featured: true,
      sortOrder: 10,
      thumbnailSrc: "/products/product-01.jpg",
      translations: {
        createMany: {
          data: [
            {
              lang: Lang.vi,
              name: "ENSO Shoe Mini",
              shortDesc: "Khử mùi giày nhanh, nhẹ mùi và thoáng không gian.",
              highlights: ["Nhỏ gọn để trong giày/tủ", "Giảm mùi ẩm mốc", "Dễ thay mới", "Không cần điện"],
              usage: "Đặt 1 gói/1 đôi giày hoặc 1–2 gói trong ngăn tủ giày.",
              seoTitle: "ENSO Shoe Mini",
              seoDesc: "Khử mùi giày nhanh, nhẹ mùi."
            },
            {
              lang: Lang.en,
              name: "ENSO Shoe Mini",
              shortDesc: "Fast odor control for shoes and small spaces.",
              highlights: ["Compact", "No electricity", "Easy to place"]
            }
          ]
        }
      },
      images: {
        createMany: { data: [{ src: "/products/product-01.jpg", sortOrder: 10 }] }
      }
    }
  });

  await prisma.product.upsert({
    where: { id: "p-enso-car-max" },
    update: {},
    create: {
      id: "p-enso-car-max",
      categoryId: catCar.id,
      priceVnd: 139000,
      salePriceVnd: 119000,
      sizeTag: "Gói 120g",
      badges: ["-20%"],
      status: Status.ACTIVE,
      featured: false,
      sortOrder: 20,
      thumbnailSrc: "/products/product-05.jpg",
      translations: {
        createMany: {
          data: [
            {
              lang: Lang.vi,
              name: "ENSO Car Max",
              shortDesc: "Cho xe rộng/đi nhiều: hiệu quả ổn định hơn.",
              highlights: ["Dung lượng lớn hơn", "Duy trì lâu hơn", "Dễ thay mới"],
              usage: "Đặt 1 gói ở cốp hoặc dưới ghế."
            }
          ]
        }
      },
      images: { createMany: { data: [{ src: "/products/product-05.jpg", sortOrder: 10 }] } }
    }
  });

  // Combos
  const combo = await prisma.combo.upsert({
    where: { id: "combo-tiet-kiem" },
    update: {},
    create: {
      id: "combo-tiet-kiem",
      priceVnd: 269000,
      salePriceVnd: null,
      badge: "Tiết kiệm nhất",
      status: Status.ACTIVE,
      sortOrder: 10,
      translations: {
        createMany: {
          data: [
            {
              lang: Lang.vi,
              title: "Combo tiết kiệm",
              subtitle: "Phủ 2–3 không gian",
              includes: ["2 sản phẩm đa dụng", "Tối ưu chi phí", "Dùng ngay"],
              savingsLine: "Tiết kiệm so với mua lẻ"
            }
          ]
        }
      },
      items: {
        createMany: {
          data: [{ productId: p1.id, quantity: 2, sortOrder: 10 }]
        }
      }
    }
  });

  // Certifications / Partners / Videos / Reviews (light demo)
  await prisma.certification.upsert({
    where: { id: "cert-ocop" },
    update: {},
    create: {
      id: "cert-ocop",
      type: CertificationType.AWARD,
      logoSrc: "/trust/ocop.png",
      certificateImageSrc: "/certs/certs-1.png",
      issuer: "OCOP",
      status: Status.PUBLISHED,
      sortOrder: 10,
      translations: {
        createMany: {
          data: [{ lang: Lang.vi, title: "OCOP 3 Sao", description: "Giải thưởng OCOP cho sản phẩm địa phương." }]
        }
      }
    }
  });

  await prisma.partner.upsert({
    where: { id: "partner-acv" },
    update: {},
    create: {
      id: "partner-acv",
      logoSrc: "/trust/acv.png",
      link: null,
      group: PartnerGroup.PARTNER,
      status: Status.PUBLISHED,
      sortOrder: 10,
      translations: {
        createMany: {
          data: [{ lang: Lang.vi, name: "Đối tác ACV", shortDesc: "Hợp tác cùng phát triển." }]
        }
      }
    }
  });

  await prisma.video.upsert({
    where: { id: "video-proof-1" },
    update: {},
    create: {
      id: "video-proof-1",
      type: VideoType.YOUTUBE,
      src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailSrc: "/video-thumbs/video-1.png",
      duration: "0:45",
      placement: VideoPlacement.VIDEO_PROOF,
      status: Status.PUBLISHED,
      sortOrder: 10,
      translations: {
        createMany: {
          data: [{ lang: Lang.vi, title: "Test khử mùi tủ giày", caption: "Tình huống thực tế (demo)" }]
        }
      }
    }
  });

  await prisma.review.upsert({
    where: { id: "rev-1" },
    update: {
      rating: 5,
      location: "TP.HCM",
      status: ReviewStatus.APPROVED,
      images: ["/reviews/review-01.jpg", "/reviews/review-02.jpg"]
    },
    create: {
      id: "rev-1",
      rating: 5,
      location: "TP.HCM",
      status: ReviewStatus.APPROVED,
      images: ["/reviews/review-01.jpg", "/reviews/review-02.jpg"],
      translations: {
        createMany: {
          data: [{ lang: Lang.vi, name: "Anh Thư", content: "Tủ giày bớt mùi hẳn, cảm giác sạch sẽ hơn." }]
        }
      }
    }
  });

  console.log("Seed completed:", { combo: combo.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


