import { NextResponse } from "next/server";
import { z } from "zod";
import { sendConsultEmail } from "@/lib/mail";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().max(160),
  company: z.string().trim().min(2).max(200),
  service: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(4000)
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const phoneDigits = parsed.data.phone.replace(/\D/g, "");
  if (phoneDigits.length < 9 || phoneDigits.length > 14) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  try {
    await sendConsultEmail(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[consult] gửi mail thất bại:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
