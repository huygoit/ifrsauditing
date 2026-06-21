"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SITE } from "@/lib/site";
import { SERVICE_IDS, type ServiceId, isServiceId } from "@/lib/services";
import { Reveal } from "@/components/Reveal";

const ICON_PHONE = (
  <path
    d="M6.6 3h3l1.5 4.5-2 1.5a13 13 0 006 6l1.5-2 4.5 1.5v3a2 2 0 01-2.2 2A17 17 0 014 5.2 2 2 0 016.6 3z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinejoin="round"
  />
);
const ICON_MAIL = (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </>
);
const ICON_PIN = (
  <>
    <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
  </>
);

type Errors = Partial<Record<"name" | "phone" | "email" | "company" | "service" | "message", string>>;

function runValidate(
  v: { name: string; phone: string; email: string; company: string; service: string; message: string },
  t: (k: string) => string
): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = t("errors.name");
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 14) e.phone = t("errors.phone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = t("errors.email");
  if (v.company.trim().length < 2) e.company = t("errors.company");
  if (!v.service.trim()) e.service = t("errors.service");
  if (v.message.trim().length < 10) e.message = t("errors.message");
  return e;
}

export function ContactSection({
  selectedServiceId,
  onConsumedService
}: {
  selectedServiceId: ServiceId | null;
  onConsumedService?: () => void;
}) {
  const t = useTranslations("ifrs.contact");
  const ts = useTranslations("ifrs.services.items");
  const locale = useLocale();
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [successChip, setSuccessChip] = useState<string | null>(null);

  const hq = locale === "en" ? SITE.hqAddressEn : SITE.hqAddressVi;
  const repHcmc = locale === "en" ? SITE.repHcmcEn : SITE.repHcmcVi;
  const repVt = locale === "en" ? SITE.repVungTauEn : SITE.repVungTauVi;

  useEffect(() => {
    if (!selectedServiceId) return;
    setService(selectedServiceId);
    onConsumedService?.();
  }, [selectedServiceId, onConsumedService]);

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSuccess(false);
    setSuccessChip(null);
    const svc = service.trim();
    const err = runValidate({ name, phone, email, company, service: svc, message }, t);
    setErrors(err);
    if (Object.keys(err).length) return;
    const chip = isServiceId(svc) ? (ts(`${svc}.title`) as string) : svc;
    setSuccessChip(chip);
    setSuccess(true);
  }

  return (
    <section id="lien-he" className="scroll-mt-32 border-t border-slate-200/80 bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold section-title tracking-tight text-emerald-700 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-xs font-medium uppercase leading-relaxed tracking-[0.14em] text-slate-500">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-7 text-white shadow-[0_24px_60px_-24px_rgba(6,78,59,0.65)] md:p-8">
              <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
              <span
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #a7f3d0 1px, transparent 0)", backgroundSize: "22px 22px" }}
                aria-hidden="true"
              />
              <ul className="relative space-y-6">
                <InfoRow icon={ICON_PHONE} label={t("cards.hotline")}>
                  <a href={`tel:${SITE.hotlineTel}`} className="font-semibold tabular-nums hover:underline">
                    {SITE.hotlineDisplay}
                  </a>
                </InfoRow>
                <InfoRow icon={ICON_MAIL} label={t("cards.email")}>
                  <a href={`mailto:${SITE.email}`} className="font-semibold hover:underline">
                    {SITE.email}
                  </a>
                </InfoRow>
                <li className="h-px bg-white/10" aria-hidden="true" />
                <InfoRow icon={ICON_PIN} label={t("cards.hq")}>
                  {hq}
                </InfoRow>
                <InfoRow icon={ICON_PIN} label={t("cards.repHcmc")}>
                  {repHcmc}
                </InfoRow>
                <InfoRow icon={ICON_PIN} label={t("cards.repVt")}>
                  {repVt}
                </InfoRow>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            {success ? (
              <div
                role="status"
                className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-8 shadow-[0_8px_32px_rgba(16,185,129,0.1)]"
              >
                <p className="text-lg font-semibold text-emerald-950">{t("success")}</p>
                <p className="mt-3 text-sm leading-relaxed text-emerald-900/85">{t("successHint")}</p>
                {successChip ? (
                  <p className="mt-3 text-sm font-medium text-emerald-800">{t("chip", { service: successChip })}</p>
                ) : null}
              </div>
            ) : (
              <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_28px_rgba(15,23,42,0.06)] md:p-9" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id={`${uid}-name`}
                    label={t("fields.name")}
                    value={name}
                    onChange={setName}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <Field
                    id={`${uid}-phone`}
                    label={t("fields.phone")}
                    value={phone}
                    onChange={setPhone}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                  <Field
                    id={`${uid}-email`}
                    label={t("fields.email")}
                    value={email}
                    onChange={setEmail}
                    error={errors.email}
                    type="email"
                    autoComplete="email"
                    className="sm:col-span-2"
                  />
                  <Field
                    id={`${uid}-company`}
                    label={t("fields.company")}
                    value={company}
                    onChange={setCompany}
                    error={errors.company}
                    autoComplete="organization"
                    className="sm:col-span-2"
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-800" htmlFor={`${uid}-svc`}>
                      {t("fields.service")}
                    </label>
                    <select
                      id={`${uid}-svc`}
                      className="mt-2 w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 aria-invalid:border-rose-300 aria-invalid:ring-rose-200/50"
                      aria-invalid={errors.service ? true : undefined}
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      <option value="">{t("fields.servicePlaceholder")}</option>
                      {SERVICE_IDS.map((id) => (
                        <option key={id} value={id}>
                          {ts(`${id}.title`)}
                        </option>
                      ))}
                    </select>
                    {errors.service ? <p className="mt-1 text-sm text-rose-600">{errors.service}</p> : null}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-800" htmlFor={`${uid}-msg`}>
                      {t("fields.message")}
                    </label>
                    <textarea
                      id={`${uid}-msg`}
                      rows={5}
                      className="mt-2 w-full resize-y rounded-xl border border-slate-200/90 bg-white px-3.5 py-3 text-sm leading-relaxed text-slate-900 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 aria-invalid:border-rose-300 aria-invalid:ring-rose-200/50"
                      aria-invalid={errors.message ? true : undefined}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("fields.messagePlaceholder")}
                    />
                    {errors.message ? <p className="mt-1 text-sm text-rose-600">{errors.message}</p> : null}
                  </div>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-8">
                  <button
                    type="submit"
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-8 text-sm font-semibold text-white shadow-brand ring-1 ring-emerald-400/20 transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto"
                  >
                    {t("submit")}
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-200 ring-1 ring-white/15" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          {icon}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">{label}</p>
        <div className="mt-1 text-sm leading-relaxed text-white/90">{children}</div>
      </div>
    </li>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-800" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={[
          "mt-2 w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition",
          "hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25",
          error ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200/90"
        ].join(" ")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p className="mt-1.5 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
