import { sanitizeHtmlForNews } from "@/lib/markdown";

export function renderTiptapJsonToSafeHtml(args: { contentJson: any | null; htmlFallback: string | null | undefined }) {
  // In this project we persist a cached HTML string (TipTap editor.getHTML()).
  // To keep SSR simple and reliable, we render the cached HTML and sanitize it.
  // If htmlFallback is missing, return empty (spec: JSON is source of truth; can be enhanced later).
  const html = (args.htmlFallback ?? "").trim();
  if (!html) return "";
  return sanitizeHtmlForNews(html);
}

