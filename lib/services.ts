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

export function isServiceId(v: string): v is ServiceId {
  return (SERVICE_IDS as readonly string[]).includes(v);
}
