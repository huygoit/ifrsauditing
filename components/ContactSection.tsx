"use client";

import { useEffect, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SITE } from "@/lib/site";
import { SERVICE_IDS, type ServiceId, isServiceId } from "@/lib/services";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

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
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-xs font-medium uppercase leading-relaxed tracking-[0.14em] text-slate-500">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-5 lg:gap-14">
          <div className="space-y-4 lg:col-span-2">
            <ContactCard title={t("cards.hotline")} body={<a href={`tel:${SITE.hotlineTel}`}>{SITE.hotlineDisplay}</a>} />
            <ContactCard title={t("cards.email")} body={<a href={`mailto:${SITE.email}`}>{SITE.email}</a>} />
            <ContactCard title={t("cards.hq")} body={hq} />
            <ContactCard title={t("cards.repHcmc")} body={repHcmc} />
            <ContactCard title={t("cards.repVt")} body={repVt} />
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
                  <Button type="submit" variant="primary" size="md" className="min-h-[48px] w-full px-8 shadow-md shadow-emerald-900/15 sm:w-auto">
                    {t("submit")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition hover:border-emerald-200/60 hover:shadow-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800/90">{title}</p>
      <div className="mt-2.5 text-sm leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:text-emerald-800 [&_a]:underline-offset-2 hover:[&_a]:underline">{body}</div>
    </div>
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
