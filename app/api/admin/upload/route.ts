import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { getUploadBasePath } from "@/lib/upload";
import crypto from "crypto";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4"
]);

function extFrom(mime: string, filename: string) {
  const lower = filename.toLowerCase();
  const fromName = path.extname(lower).replace(".", "");
  if (fromName && fromName.length <= 8) return fromName;
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/svg+xml") return "svg";
  if (mime === "video/mp4") return "mp4";
  return "bin";
}

function safeFolder(raw: string | null) {
  const v = (raw ?? "uploads").trim();
  // allow "uploads", "uploads/products", "uploads/videos"...
  const cleaned = v
    .replace(/\\/g, "/")
    .replace(/\.\./g, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  return cleaned || "uploads";
}

export async function POST(req: NextRequest) {
  try {
    const { response } = await requireAdminSession(req);
    if (response) return response;

    const form = await req.formData();
    const folder = safeFolder(form.get("folder")?.toString() ?? null);
    const files = form.getAll("file").filter(Boolean);
    if (!files.length) return NextResponse.json({ error: "no_file" }, { status: 400 });

    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const relDir = path.posix.join("uploads", yyyy, mm, folder === "uploads" ? "" : folder.replace(/^uploads\/?/, ""));
    const publicDir = path.join(getUploadBasePath(), relDir);
    await fs.mkdir(publicDir, { recursive: true });

    const out: Array<{ src: string; name: string; size: number; type: string }> = [];

    for (const anyFile of files) {
      const file = anyFile as unknown as File;
      const mime = (file as any)?.type ?? "";
      const size = (file as any)?.size ?? 0;
      const name = (file as any)?.name ?? "upload";
      if (!mime || !ALLOWED_MIME.has(mime)) return NextResponse.json({ error: "unsupported_type", mime }, { status: 415 });
      if (size > 20 * 1024 * 1024) return NextResponse.json({ error: "file_too_large" }, { status: 413 });

      const ext = extFrom(mime, name);
      const token = crypto.randomBytes(10).toString("hex");
      const base = `${Date.now()}-${token}.${ext}`;
      const abs = path.join(publicDir, base);

      const buf = Buffer.from(await file.arrayBuffer());
      // `fs.writeFile` typing can be strict in some TS libs; cast is safe here.
      await fs.writeFile(abs, buf as unknown as Uint8Array);

      out.push({
        src: `/${relDir}/${base}`.replace(/\/+/g, "/"),
        name,
        size,
        type: mime
      });
    }

    return NextResponse.json({ ok: true, files: out });
  } catch (e: unknown) {
    console.error("[admin/upload] failed", e);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "server_error", detail: e instanceof Error ? e.message : String(e) },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


