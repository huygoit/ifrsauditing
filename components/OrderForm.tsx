"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type OrderPayload = {
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  selection: string;
  quantity: number;
  note: string;
};

function onlyDigits(s: string) {
  return s.replace(/[^\d]/g, "");
}

export function OrderForm({
  options,
  defaultSelection,
  defaultQuantity = 1,
  onOrderSuccessReset,
  /** true: không bọc viền/card — dùng khi cha đã là một khối card (vd. trang chi tiết sản phẩm) */
  embedded = false
}: {
  options: { value: string; label: string }[];
  defaultSelection: string;
  /** Đồng bộ số lượng từ trang chi tiết (sidebar) */
  defaultQuantity?: number;
  onOrderSuccessReset?: () => void;
  embedded?: boolean;
}) {
  const t = useTranslations("home.order");
  const validate = (payload: Omit<OrderPayload, "createdAt">) => {
    const errors: Partial<Record<keyof Omit<OrderPayload, "createdAt">, string>> = {};
    if (payload.name.trim().length < 2) errors.name = t("errors.name");
    const digits = onlyDigits(payload.phone);
    if (!(digits.length === 10 || digits.length === 11)) errors.phone = t("errors.phone");
    if (payload.address.trim().length < 6) errors.address = t("errors.address");
    // Selection & quantity are hidden in UI (kept for internal payload).
    if (!payload.selection.trim()) errors.selection = t("errors.selection");
    if (payload.quantity < 1 || payload.quantity > 10) errors.quantity = t("errors.quantity");
    return errors;
  };

  const initial = useMemo(
    () => ({
      name: "",
      phone: "",
      address: "",
      selection: defaultSelection,
      note: ""
    }),
    [defaultSelection]
  );

  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [address, setAddress] = useState(initial.address);
  const [selection, setSelection] = useState(initial.selection);
  const [quantity, setQuantity] = useState(() =>
    Math.min(10, Math.max(1, Math.floor(defaultQuantity)))
  );
  const [note, setNote] = useState(initial.note);

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [success, setSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderPayload | null>(null);

  useEffect(() => {
    // Đồng bộ lựa chọn / số lượng khi đổi sản phẩm hoặc đổi số lượng bên ngoài form
    setSelection(defaultSelection);
    const q = Math.min(10, Math.max(1, Math.floor(defaultQuantity)));
    setQuantity(q);
    setSuccess(false);
    setLastOrder(null);
    setErrors({});
  }, [defaultSelection, defaultQuantity]);

  function reset() {
    setName("");
    setPhone("");
    setAddress("");
    setSelection(defaultSelection);
    setQuantity(1);
    setNote("");
    setErrors({});
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    const payload = { name, phone, address, selection, quantity, note };
    const v = validate(payload);
    setErrors(v);
    if (Object.keys(v).length) return;

    const fullPayload: OrderPayload = { ...payload, createdAt: new Date().toISOString() };
    try {
      const key = "enso_order_payloads";
      const existing = localStorage.getItem(key);
      const arr = existing ? (JSON.parse(existing) as OrderPayload[]) : [];
      arr.unshift(fullPayload);
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 20)));
    } catch {
      // ignore
    }

    setLastOrder(fullPayload);
    setSuccess(true);
    reset();
    onOrderSuccessReset?.();
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        embedded ? "w-full" : "rounded-2xl border border-slate-200 bg-white p-6 shadow-md"
      }
    >
      {!embedded ? (
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{t("quickTitle")}</h3>
            <p className="mt-1 text-sm text-slate-600">{t("quickSubtitle")}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-4 py-1 text-center text-xs font-semibold text-emerald-700">
            {t("secure")}
          </span>
        </div>
      ) : null}

      {success && lastOrder ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p>
                <span className="font-semibold">{t("successTitle")}</span> {t("successSubtitle")}
              </p>
              <p className="mt-1 text-xs text-emerald-800">
                {t("orderLine", { selection: lastOrder.selection, qty: lastOrder.quantity })}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`grid gap-4 ${embedded ? "mt-0" : "mt-5"}`}>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="name">
            {t("fields.name")}
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            placeholder={t("placeholders.name")}
          />
          {errors.name ? <p className="text-xs font-semibold text-rose-600">{errors.name}</p> : null}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="phone">
            {t("fields.phone")}
          </label>
          <input
            id="phone"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            placeholder={t("placeholders.phone")}
          />
          {errors.phone ? <p className="text-xs font-semibold text-rose-600">{errors.phone}</p> : null}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="address">
            {t("fields.address")}
          </label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            placeholder={t("placeholders.address")}
          />
          {errors.address ? <p className="text-xs font-semibold text-rose-600">{errors.address}</p> : null}
        </div>

        {/* Hide selection & quantity inputs per requirement. */}
        {errors.selection || errors.quantity ? (
          <p className="text-xs font-semibold text-rose-600">{t("errors.selection")}</p>
        ) : null}

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="note">
            {t("fields.note")}
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            placeholder={t("placeholders.note")}
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          {t("submit")}
        </button>

        <p className="text-center text-xs font-semibold text-slate-600">{t("badgesLine")}</p>

        <p className="text-xs text-slate-500">
          {t("demoNote")}
        </p>
      </div>
    </form>
  );
}


