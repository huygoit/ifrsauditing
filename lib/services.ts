/** Mã dịch vụ — khớp với khóa dịch `ifrs.services.items.*` trong messages. */
export const SERVICE_IDS = [
  "audit",
  "tax",
  "accounting",
  "valuation",
  "transferPricing",
  "advisory",
  "training",
  "ifrsVas"
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

/** 6 dịch vụ tiêu biểu hiển thị ở trang chủ (giữ SERVICE_IDS đầy đủ cho trang chi tiết/drawer). */
export const FEATURED_SERVICE_IDS = [
  "audit",
  "tax",
  "accounting",
  "valuation",
  "advisory",
  "training"
] as const satisfies readonly ServiceId[];

export function isServiceId(v: string): v is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(v);
}
