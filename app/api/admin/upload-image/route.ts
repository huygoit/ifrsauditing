import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { getUploadBasePath } from "@/lib/upload";
import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function extFrom(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "bin";
}

export async function POST(req: NextRequest) {
  try {
    const { response } = await requireAdminSession(req);
    if (response) return response;

    const form = await req.formData();
    const anyFile = form.get("file");
    if (!anyFile) return NextResponse.json({ error: "no_file" }, { status: 400 });

    const file = anyFile as unknown as File;
    const mime = (file as any)?.type ?? "";
    const size = (file as any)?.size ?? 0;
    if (!mime || !ALLOWED_MIME.has(mime)) return NextResponse.json({ error: "unsupported_type", mime }, { status: 415 });
    if (size > 5 * 1024 * 1024) return NextResponse.json({ error: "file_too_large" }, { status: 413 });

    const relDir = path.posix.join("uploads", "news");
    const publicDir = path.join(getUploadBasePath(), relDir);
    await fs.mkdir(publicDir, { recursive: true });

    const ext = extFrom(mime);
    const token = crypto.randomBytes(10).toString("hex");
    const base = `${Date.now()}-${token}.${ext}`;
    const abs = path.join(publicDir, base);

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(abs, buf as unknown as Uint8Array);

    const url = `/${relDir}/${base}`.replace(/\/+/g, "/");
    return NextResponse.json({ url });
  } catch (e: unknown) {
    console.error("[admin/upload-image] failed", e);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: "server_error", detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

