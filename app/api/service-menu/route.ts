import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getServiceMenu } from "@/lib/siteContent/getServiceMenu";

export const runtime = "nodejs";

const Query = z.object({
  lang: z.enum(["vi", "en"]).optional()
});

export async function GET(req: NextRequest) {
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(sp);
  if (!parsed.success) return NextResponse.json({ items: [] });

  const lang = parsed.data.lang ?? "vi";
  try {
    const items = await getServiceMenu(lang);
    return NextResponse.json(
      { items },
      { headers: { "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ items: [] });
  }
}
