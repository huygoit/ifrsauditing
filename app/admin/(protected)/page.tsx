import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin/serverSession";

function Card({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-600">{hint}</p> : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  // Static export builds should not attempt to run admin (needs server runtime + DB + cookies).
  if (process.env.NEXT_OUTPUT === "export") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Requires server runtime</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Admin panel không chạy trong chế độ static export. Hãy chạy <span className="font-semibold">npm run dev</span>{" "}
          (không set <span className="font-semibold">NEXT_OUTPUT=export</span>) để dùng Admin.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Đi tới /admin/login
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            Về landing
          </a>
        </div>
      </div>
    );
  }

  const user = await requireAdminUser();

  const [newOrders, pendingReviews, publishedPosts] = await Promise.all([
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.post.count({ where: { status: "PUBLISHED" } })
  ]);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Welcome</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {user.username} <span className="text-slate-400">/</span> {user.role}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          VIP PRO Admin — ít click, chỉnh nhanh, và có fallback đa ngôn ngữ (VI/EN).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="New orders" value={String(newOrders)} hint="Feature toggle vẫn sẽ có ở Settings." />
        <Card title="Pending reviews" value={String(pendingReviews)} hint="Duyệt / ẩn chỉ 1 click." />
        <Card title="Published posts" value={String(publishedPosts)} hint="Tháng này (demo)."/>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Quick actions</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/products", label: "Add product" },
              { href: "/admin/certifications", label: "Add certification" },
              { href: "/admin/videos", label: "Add video" },
              { href: "/admin/posts", label: "Add post" }
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Notes</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Ctrl/Cmd+K: Command palette (scaffold)</li>
            <li>• Drawer: Create/Edit (đang triển khai theo module)</li>
            <li>• Upload: /public/uploads (StorageService)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


