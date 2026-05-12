import type { Lang } from "@prisma/client";

export function parseLang(input: unknown): Lang {
  return input === "en" ? "en" : "vi";
}


