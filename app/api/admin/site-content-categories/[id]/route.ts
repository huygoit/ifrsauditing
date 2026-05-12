import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { slugifyAscii } from "@/lib/slug";

function isDuplicateSlugError(e: unknown) {
  const msg = String((e as any)?.message ?? "");
  return msg.includes("Duplicate entry") && msg.includes("sitecontentcategorytranslation_lang_slug_key");
}

async function suggestUniqueSlug(lang: "vi" | "en", baseSlug: string) {
  const rows = (await prisma.$queryRaw`
    SELECT slug
    FROM sitecontentcategorytranslation
    WHERE lang = ${lang} AND slug LIKE ${baseSlug + "%"}
  `) as Array<{ slug: string }>;

  const used = new Set(rows.map((r) => r.slug));
  if (!used.has(baseSlug)) return baseSlug;

  let maxN = 1;
  for (const s of used) {
    const m = s.match(new RegExp(`^${baseSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-([0-9]+)$`));
    if (m?.[1]) maxN = Math.max(maxN, Number(m[1]) || 1);
  }
  return `${baseSlug}-${maxN + 1}`;
}

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const rows = (await prisma.$queryRaw`
    SELECT id, status, sortOrder, createdAt, updatedAt
    FROM sitecontentcategory
    WHERE id = ${id}
    LIMIT 1
  `) as Array<{ id: string; status: string; sortOrder: number; createdAt: Date; updatedAt: Date }>;

  const item = rows[0] ?? null;
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const translations = (await prisma.$queryRaw`
    SELECT id, siteContentCategoryId, lang, name, slug, description, seoTitle, seoDesc
    FROM sitecontentcategorytranslation
    WHERE siteContentCategoryId = ${id}
  `) as Array<{
    id: string;
    lang: "vi" | "en";
    name: string;
    slug: string;
    description: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
  }>;

  return NextResponse.json({ item: { ...item, translations } });
}

const PatchBody = z.object({
  lang: z.enum(["vi", "en"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sortOrder: z.number().int().min(0).max(999999).optional(),
  name: z.string().min(1).max(160).optional(),
  slug: z.string().max(160).optional(),
  description: z.string().max(20000).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDesc: z.string().max(20000).optional()
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const { response } = await requireAdminSession(req);
  if (response) return response;

  const id = ctx.params.id;
  const json = await req.json().catch(() => null);
  const parsed = PatchBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const { lang, status, sortOrder, name, slug, description, seoTitle, seoDesc } = parsed.data;

  const exists = (await prisma.$queryRaw`
    SELECT id
    FROM sitecontentcategory
    WHERE id = ${id}
    LIMIT 1
  `) as Array<{ id: string }>;
  if (!exists.length) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const normalizedSlug = slug !== undefined ? slugifyAscii(slug) : undefined;
  const baseForSuggestion = (normalizedSlug ?? (name ? slugifyAscii(name) : "")).trim();

  try {
    await prisma.$transaction(async (tx) => {
      if (status !== undefined && typeof sortOrder === "number") {
        await tx.$executeRaw`
          UPDATE sitecontentcategory
          SET status = ${status}, sortOrder = ${sortOrder}, updatedAt = NOW(3)
          WHERE id = ${id}
        `;
      } else if (status !== undefined) {
        await tx.$executeRaw`
        UPDATE sitecontentcategory
        SET status = ${status}, updatedAt = NOW(3)
        WHERE id = ${id}
        `;
      } else if (typeof sortOrder === "number") {
        await tx.$executeRaw`
        UPDATE sitecontentcategory
        SET sortOrder = ${sortOrder}, updatedAt = NOW(3)
        WHERE id = ${id}
        `;
      }

      if (name !== undefined || description !== undefined || normalizedSlug !== undefined || seoTitle !== undefined || seoDesc !== undefined) {
        const tRows = (await tx.$queryRaw`
          SELECT id, name, slug, description, seoTitle, seoDesc
          FROM sitecontentcategorytranslation
          WHERE siteContentCategoryId = ${id} AND lang = ${lang}
          LIMIT 1
        `) as Array<{ id: string; name: string; slug: string; description: string | null; seoTitle: string | null; seoDesc: string | null }>;

        const t = tRows[0] ?? null;
        const nextName = (name ?? t?.name ?? "").trim();
        const nextSlug = (normalizedSlug ?? t?.slug ?? slugifyAscii(nextName)).trim();
        const nextDesc = description !== undefined ? (description.trim() ? description.trim() : null) : (t?.description ?? null);
        const nextSeoTitle = seoTitle !== undefined ? (seoTitle.trim() ? seoTitle.trim() : null) : (t?.seoTitle ?? null);
        const nextSeoDesc = seoDesc !== undefined ? (seoDesc.trim() ? seoDesc.trim() : null) : (t?.seoDesc ?? null);
        if (!nextSlug) throw new Error("invalid_slug");

        if (t) {
          await tx.$executeRaw`
            UPDATE sitecontentcategorytranslation
            SET name = ${nextName}, slug = ${nextSlug}, description = ${nextDesc}, seoTitle = ${nextSeoTitle}, seoDesc = ${nextSeoDesc}
            WHERE id = ${t.id}
          `;
        } else {
          const tid = randomUUID();
          await tx.$executeRaw`
            INSERT INTO sitecontentcategorytranslation (id, siteContentCategoryId, lang, name, slug, description, seoTitle, seoDesc)
            VALUES (
              ${tid},
              ${id},
              ${lang},
              ${nextName},
              ${nextSlug},
              ${nextDesc},
              ${nextSeoTitle},
              ${nextSeoDesc}
            )
          `;
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (isDuplicateSlugError(e)) {
      const suggestion = baseForSuggestion ? await suggestUniqueSlug(lang, baseForSuggestion) : undefined;
      return NextResponse.json({ error: "slug_conflict", suggestion }, { status: 409 });
    }
    console.error("[admin/site-content-categories/[id]][PATCH] update failed", e);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "server_error", detail: e instanceof Error ? e.message : String(e) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
