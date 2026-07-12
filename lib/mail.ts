import nodemailer from "nodemailer";

/** Đọc cấu hình SMTP từ biến môi trường (PA Việt Nam). */
export function getMailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS ?? "";
  const to = process.env.MAIL_TO?.trim() || user;
  const from = process.env.MAIL_FROM?.trim() || user;
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  if (!host || !user || !pass || !to || !from) {
    throw new Error("Thiếu cấu hình SMTP (SMTP_HOST/USER/PASS hoặc MAIL_TO/FROM).");
  }

  return { host, port, secure, user, pass, to, from };
}

export function createTransport() {
  const cfg = getMailConfig();
  return {
    cfg,
    transporter: nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass }
    })
  };
}

export type ConsultPayload = {
  name: string;
  phone: string;
  email: string;
  company: string;
  service: string;
  message: string;
};

/** Gửi mail đăng ký tư vấn tới hộp thư công ty. */
export async function sendConsultEmail(payload: ConsultPayload) {
  const { cfg, transporter } = createTransport();
  const subject = `[Đăng ký tư vấn] ${payload.name} — ${payload.company}`;
  const text = [
    "Có yêu cầu đăng ký tư vấn mới từ website:",
    "",
    `Họ và tên: ${payload.name}`,
    `Số điện thoại: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Doanh nghiệp: ${payload.company}`,
    `Dịch vụ quan tâm: ${payload.service}`,
    "",
    "Nội dung:",
    payload.message,
    "",
    `Thời gian: ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#0f172a">
      <p><strong>Có yêu cầu đăng ký tư vấn mới từ website</strong></p>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><strong>Họ và tên</strong></td><td>${escapeHtml(payload.name)}</td></tr>
        <tr><td><strong>Số điện thoại</strong></td><td>${escapeHtml(payload.phone)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(payload.email)}</td></tr>
        <tr><td><strong>Doanh nghiệp</strong></td><td>${escapeHtml(payload.company)}</td></tr>
        <tr><td><strong>Dịch vụ quan tâm</strong></td><td>${escapeHtml(payload.service)}</td></tr>
      </table>
      <p><strong>Nội dung:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    replyTo: payload.email,
    subject,
    text,
    html
  });

  return info;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
