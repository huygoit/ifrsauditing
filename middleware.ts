import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const PUBLIC_ADMIN_API = ["/api/admin/auth/login"];

const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: "always"
});

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip non-admin APIs for intl routing
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/admin")) return NextResponse.next();

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return intlMiddleware(req);

  // Always allow Next internals
  if (pathname.startsWith("/_next")) return NextResponse.next();

  // Allow login routes
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p)) return NextResponse.next();
  if (PUBLIC_ADMIN_API.some((p) => pathname === p)) return NextResponse.next();

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    if (isAdminApi) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};


