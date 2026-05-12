import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  gfm: true,
  breaks: true
});

export function renderMarkdownToSafeHtml(markdown: string) {
  const md = (markdown ?? "").trim();
  if (!md) return "";

  const rawHtml = marked.parse(md) as string;

  return sanitizeHtml(rawHtml, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "s",
      "u",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "pre",
      "code",
      "a",
      "img"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"]
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer", target: "_blank" })
    }
  });
}

/**
 * Chuỗi có phải HTML do TipTap (editor admin) lưu không: phải bắt đầu bằng thẻ khối.
 * Tránh nhận nhầm Markdown (có thể chứa `<` ở giữa) thành HTML → sanitizer làm hỏng nội dung.
 */
function isProbablyTipTapHtmlFragment(raw: string): boolean {
  const t = raw.trim();
  if (!t.startsWith("<")) return false;
  return /^<(p|h[1-6]|div|ul|ol|blockquote|pre|img|hr|figure|table)\b/i.test(t);
}

/**
 * Sanitize nội dung mô tả sản phẩm sau Markdown hoặc HTML TipTap — cùng một allowlist.
 * Gồm GFM (bảng), heading đủ cấp, căn lề TextAlign từ admin.
 */
export function sanitizeProductBodyHtml(html: string) {
  const s = (html ?? "").trim();
  if (!s) return "";
  return sanitizeHtml(s, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "s",
      "u",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "pre",
      "code",
      "a",
      "img",
      "div",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      h5: ["style"],
      h6: ["style"],
      div: ["style"],
      th: ["colspan", "rowspan", "align"],
      td: ["colspan", "rowspan", "align"]
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/i, /^right$/i, /^center$/i, /^justify$/i]
      }
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer", target: "_blank" })
    }
  });
}

/**
 * Admin: NewsEditor (TipTap) lưu HTML qua trường descriptionMarkdown; dữ liệu cũ có thể là Markdown thuần.
 * Trang public: nếu chuỗi mở đầu giống fragment TipTap → sanitize HTML; không thì parse Markdown (GFM) rồi sanitize.
 */
export function renderProductDescriptionToSafeHtml(raw: string) {
  const s = (raw ?? "").trim();
  if (!s) return "";
  if (isProbablyTipTapHtmlFragment(s)) {
    return sanitizeProductBodyHtml(s);
  }
  const mdHtml = marked.parse(s) as string;
  return sanitizeProductBodyHtml(mdHtml);
}

export function sanitizeHtmlForNews(html: string) {
  const s = (html ?? "").trim();
  if (!s) return "";
  return sanitizeHtml(s, {
    allowedTags: [
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "s",
      "u",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "pre",
      "code",
      "a",
      "img"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"]
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer", target: "_blank" })
    }
  });
}

