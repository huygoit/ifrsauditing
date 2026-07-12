/**
 * Thử gửi mail SMTP (đọc .env.local).
 * Chạy: node scripts/test-smtp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 0) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile(path.resolve(".env"));
loadEnvFile(path.resolve(".env.local"));

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 465);
const secure = process.env.SMTP_SECURE === "true" || port === 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const to = process.env.MAIL_TO || user;
const from = process.env.MAIL_FROM || user;

if (!host || !user || !pass) {
  console.error("Thiếu SMTP_HOST / SMTP_USER / SMTP_PASS");
  process.exit(1);
}

console.log(`Kết nối ${host}:${port} (secure=${secure}) với user ${user}...`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass }
});

try {
  await transporter.verify();
  console.log("Xác thực SMTP: OK");

  const info = await transporter.sendMail({
    from,
    to,
    subject: "[Thử SMTP] IFRS Auditing website",
    text: "Đây là email thử từ scripts/test-smtp.mjs. Nếu nhận được thư này thì cấu hình SMTP đã hoạt động."
  });

  console.log("Gửi mail: OK");
  console.log("messageId:", info.messageId);
  console.log("response:", info.response);
} catch (err) {
  console.error("THẤT BẠI:", err?.message || err);
  process.exit(1);
}
