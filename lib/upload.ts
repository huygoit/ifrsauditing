import path from "path";

/**
 * Base path for uploaded files.
 * - If UPLOAD_BASE_PATH env is set: use it (e.g. /var/data/ensodana).
 *   Uploads go to {UPLOAD_BASE_PATH}/uploads/... and should be served by Nginx.
 * - If not set: use {cwd}/public for backward compatibility (Next.js serves from public/).
 */
export function getUploadBasePath(): string {
  const raw = process.env.UPLOAD_BASE_PATH?.trim();
  if (raw) return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  return path.join(process.cwd(), "public");
}
