"use client";

import { useEffect, useMemo, useState } from "react";
import { tAdmin } from "@/lib/admin/i18n";

type Lang = "vi" | "en";

type SettingsItem = {
  id: string;
  hotline: string;
  zaloUrl: string;
  address: string | null;
  socialLinks: any;
  ordersEnabled: boolean;
  translation: {
    lang: Lang;
    topBarMessage: string | null;
    shippingPolicy: string | null;
    returnPolicy: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
  };
  meta: { missingLang: boolean };
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function SettingsClient({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<SettingsItem | null>(null);

  // base
  const [hotline, setHotline] = useState("");
  const [zaloUrl, setZaloUrl] = useState("");
  const [address, setAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState("{\n  \"facebook\": \"\",\n  \"youtube\": \"\",\n  \"zalo\": \"\"\n}");
  const [ordersEnabled, setOrdersEnabled] = useState(true);

  // translations
  const [topBarMessage, setTopBarMessage] = useState("");
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  const viFallback = useMemo(() => (lang === "en" && item?.translation?.lang === "vi" ? item.translation : null), [lang, item]);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const l = sp.get("lang");
    setLang(l === "en" ? "en" : "vi");
  }, []);

  function switchLang(next: Lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.location.href = url.toString();
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/settings?lang=${lang}`, { cache: "no-store" });
      const json = await res.json();
      const it: SettingsItem | null = json?.item ?? null;
      setItem(it);
      setHotline(it?.hotline ?? "");
      setZaloUrl(it?.zaloUrl ?? "");
      setAddress(it?.address ?? "");
      setOrdersEnabled(Boolean(it?.ordersEnabled));
      setSocialLinks(JSON.stringify(it?.socialLinks ?? { facebook: "", youtube: "", zalo: "" }, null, 2));
      setTopBarMessage(it?.translation?.topBarMessage ?? "");
      setShippingPolicy(it?.translation?.shippingPolicy ?? "");
      setReturnPolicy(it?.translation?.returnPolicy ?? "");
      setSeoTitle(it?.translation?.seoTitle ?? "");
      setSeoDesc(it?.translation?.seoDesc ?? "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      let social: any = null;
      try {
        social = socialLinks.trim() ? JSON.parse(socialLinks) : null;
      } catch {
        throw new Error("social_json_invalid");
      }

      const payload = {
        lang,
        hotline: hotline.trim(),
        zaloUrl: zaloUrl.trim(),
        address: address.trim() ? address.trim() : null,
        socialLinks: social,
        ordersEnabled,
        topBarMessage: topBarMessage.trim() ? topBarMessage.trim() : null,
        shippingPolicy: shippingPolicy.trim() ? shippingPolicy.trim() : null,
        returnPolicy: returnPolicy.trim() ? returnPolicy.trim() : null,
        seoTitle: seoTitle.trim() ? seoTitle.trim() : null,
        seoDesc: seoDesc.trim() ? seoDesc.trim() : null
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("save_failed");
      await load();
    } catch (e: any) {
      setError(e?.message === "social_json_invalid" ? "SocialLinks JSON không hợp lệ." : "Không lưu được. Thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {tAdmin(lang as any, "admin.settings.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button type="button" onClick={() => switchLang("vi")} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "vi" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}>
                VI
              </button>
              <button type="button" onClick={() => switchLang("en")} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition", lang === "en" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50")}>
                EN
              </button>
            </div>
            <button type="button" onClick={save} disabled={saving || loading} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">
              {saving ? tAdmin(lang as any, "common.loading") : tAdmin(lang as any, "common.save")}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {lang === "en" && item?.meta?.missingLang ? (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                EN thiếu — đang fallback VI. Bạn có thể nhập EN và Save để tạo translation.
              </div>
            ) : null}

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Hotline">
                  <input value={hotline} onChange={(e) => setHotline(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
                </Field>
                <Field label="Zalo URL">
                  <input value={zaloUrl} onChange={(e) => setZaloUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
                </Field>
              </div>

              <Field label="Address (optional)">
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
              </Field>

              <Field label="Orders enabled">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Enable orders</p>
                  <button
                    type="button"
                    onClick={() => setOrdersEnabled((x) => !x)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition",
                      ordersEnabled ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {ordersEnabled ? "ON" : "OFF"}
                  </button>
                </div>
              </Field>

              <Field label="Social links (JSON)" hint='VD: {"facebook":"...","youtube":"...","zalo":"..."}'>
                <textarea value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} rows={6} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
              </Field>

              <Field label="Top bar message (translation)">
                <input value={topBarMessage} onChange={(e) => setTopBarMessage(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" placeholder="COD toàn quốc • Giao nhanh…" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="SEO title (translation)">
                  <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
                </Field>
                <Field label="SEO desc (translation)">
                  <input value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
                </Field>
              </div>
              <Field label="Shipping policy (translation)">
                <textarea value={shippingPolicy} onChange={(e) => setShippingPolicy(e.target.value)} rows={5} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
              </Field>
              <Field label="Return policy (translation)">
                <textarea value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} rows={5} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2" />
              </Field>

              {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Preview</p>
            <div className="mt-3 grid gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">Top bar</p>
                <p className="mt-1 text-sm text-slate-900">{topBarMessage || <span className="text-slate-500">—</span>}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">Contact</p>
                <p className="mt-1 text-sm text-slate-900">Hotline: {hotline || "—"}</p>
                <p className="mt-1 text-sm text-slate-900">Zalo: {zaloUrl || "—"}</p>
                {address ? <p className="mt-1 text-sm text-slate-900">Address: {address}</p> : null}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">Orders</p>
                <p className="mt-1 text-sm text-slate-900">
                  ordersEnabled: <span className={cn("font-semibold", ordersEnabled ? "text-emerald-700" : "text-rose-700")}>{ordersEnabled ? "ON" : "OFF"}</span>
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">Policies</p>
                <p className="mt-2 text-xs font-semibold text-slate-600">Shipping</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{shippingPolicy || "—"}</p>
                <p className="mt-3 text-xs font-semibold text-slate-600">Return</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{returnPolicy || "—"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">SEO</p>
                <p className="mt-1 text-sm text-slate-900">{seoTitle || "—"}</p>
                <p className="mt-1 text-sm text-slate-600">{seoDesc || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


