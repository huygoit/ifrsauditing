export function slugifyAscii(input: string) {
  // SEO-safe slug: a-z0-9- (no diacritics, no unicode letters)
  // - Convert Vietnamese diacritics via NFD + strip combining marks
  // - Normalize đ/Đ → d
  // - Collapse whitespace/dashes into single dash
  const s = (input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return s;
}

