export type Lang = "vi" | "en";

export type FaqStatus = "VISIBLE" | "HIDDEN";

export type ListFaqsParams = {
  lang: Lang;
  q?: string;
  status?: FaqStatus;
  sectionKey?: string;
  page?: number;
  pageSize?: number;
};

export async function listFaqs(params: ListFaqsParams) {
  const sp = new URLSearchParams();
  sp.set("lang", params.lang);
  if (params.q) sp.set("q", params.q);
  if (params.status) sp.set("status", params.status);
  if (params.sectionKey) sp.set("sectionKey", params.sectionKey);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  const res = await fetch(`/api/admin/faq?${sp.toString()}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, items: Array.isArray((json as any)?.items) ? (json as any).items : [], ...json };
}

export async function getFaq(id: number) {
  const res = await fetch(`/api/admin/faq/${id}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, ...json };
}

export async function createFaq(body: {
  lang: Lang;
  question: string;
  answer: string;
  sectionKey?: string | null;
  status?: FaqStatus;
  sortOrder?: number;
}) {
  const res = await fetch("/api/admin/faq", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? "create_failed");
  return { ok: res.ok, ...json };
}

export async function updateFaq(
  id: number,
  body: Partial<{
    lang: Lang;
    question: string;
    answer: string;
    sectionKey: string | null;
    status: FaqStatus;
    sortOrder: number;
  }>
) {
  const res = await fetch(`/api/admin/faq/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, ...json };
}

export async function deleteFaq(id: number) {
  const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? "delete_failed");
  return { ok: res.ok, ...json };
}

export async function bulkFaq(body: { ids: number[]; action: "set_visible" | "set_hidden" | "delete" }) {
  const res = await fetch("/api/admin/faq/bulk", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? "bulk_failed");
  return { ok: res.ok, ...json };
}

export async function reorderFaqs(body: { ids: number[] }) {
  const res = await fetch("/api/admin/faq/reorder", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? "reorder_failed");
  return { ok: res.ok, ...json };
}

