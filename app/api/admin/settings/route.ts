import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { parseLang } from "@/lib/admin/lang";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional()
});

export async function GET(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });

  const lang = parseLang(parsed.data.lang);
  const setting = await prisma.setting.findUnique({
    where: { id: "default" },
    include: { translations: { where: { lang }, select: { topBarMessage: true, shippingPolicy: true, returnPolicy: true, seoTitle: true, seoDesc: true } } }
  });

  const fallbackVi =
    lang === "en"
      ? await prisma.settingTranslation.findUnique({
          where: { settingId_lang: { settingId: "default", lang: "vi" } },
          select: { topBarMessage: true, shippingPolicy: true, returnPolicy: true, seoTitle: true, seoDesc: true }
        })
      : null;

  const base = setting ?? (await prisma.setting.create({ data: { id: "default", hotline: "0852795939", zaloUrl: "https://zalo.me/0852795939" } }));
  const t = setting?.translations?.[0] ?? null;

  return NextResponse.json({
    item: {
      id: base.id,
      hotline: base.hotline,
      zaloUrl: base.zaloUrl,
      address: base.address,
      socialLinks: base.socialLinks,
      ordersEnabled: base.ordersEnabled,
      translation: t
        ? { lang, ...t }
        : fallbackVi
          ? { lang: "vi", ...fallbackVi }
          : { lang, topBarMessage: "", shippingPolicy: "", returnPolicy: "", seoTitle: "", seoDesc: "" },
      meta: { missingLang: lang === "en" ? !t : false }
    }
  });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  hotline: z.string().max(40).optional(),
  zaloUrl: z.string().max(200).optional(),
  address: z.string().max(300).optional().nullable(),
  socialLinks: z.any().optional().nullable(),
  ordersEnabled: z.boolean().optional(),
  topBarMessage: z.string().max(500).optional().nullable(),
  shippingPolicy: z.string().max(5000).optional().nullable(),
  returnPolicy: z.string().max(5000).optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDesc: z.string().max(500).optional().nullable()
});

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, topBarMessage, shippingPolicy, returnPolicy, seoTitle, seoDesc, ...base } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.setting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        hotline: base.hotline ?? "0852795939",
        zaloUrl: base.zaloUrl ?? "https://zalo.me/0852795939",
        address: base.address ?? null,
        socialLinks: base.socialLinks ?? null,
        ordersEnabled: base.ordersEnabled ?? true
      },
      update: {
        ...(base.hotline !== undefined ? { hotline: base.hotline } : {}),
        ...(base.zaloUrl !== undefined ? { zaloUrl: base.zaloUrl } : {}),
        ...(base.address !== undefined ? { address: base.address ?? null } : {}),
        ...(base.socialLinks !== undefined ? { socialLinks: base.socialLinks ?? null } : {}),
        ...(base.ordersEnabled !== undefined ? { ordersEnabled: base.ordersEnabled } : {})
      }
    });

    const hasAnyTranslation =
      topBarMessage !== undefined ||
      shippingPolicy !== undefined ||
      returnPolicy !== undefined ||
      seoTitle !== undefined ||
      seoDesc !== undefined;

    if (!hasAnyTranslation) return;

    const existing = await tx.settingTranslation.findUnique({
      where: { settingId_lang: { settingId: "default", lang } }
    });
    if (existing) {
      await tx.settingTranslation.update({
        where: { id: existing.id },
        data: {
          ...(topBarMessage !== undefined ? { topBarMessage: topBarMessage || null } : {}),
          ...(shippingPolicy !== undefined ? { shippingPolicy: shippingPolicy || null } : {}),
          ...(returnPolicy !== undefined ? { returnPolicy: returnPolicy || null } : {}),
          ...(seoTitle !== undefined ? { seoTitle: seoTitle || null } : {}),
          ...(seoDesc !== undefined ? { seoDesc: seoDesc || null } : {})
        }
      });
    } else {
      await tx.settingTranslation.create({
        data: {
          settingId: "default",
          lang,
          topBarMessage: topBarMessage || null,
          shippingPolicy: shippingPolicy || null,
          returnPolicy: returnPolicy || null,
          seoTitle: seoTitle || null,
          seoDesc: seoDesc || null
        }
      });
    }
  });

  return NextResponse.json({ ok: true });
}


