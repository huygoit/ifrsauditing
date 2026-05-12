import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth";

export async function requireAdminUser() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  const s = await prisma.session.findFirst({
    where: { token, revokedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true }
  });
  if (!s) redirect("/admin/login");
  return s.user;
}


