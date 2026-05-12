You are a senior brand designer + Next.js engineer. Redesign and rebuild a Vietnamese e-commerce/marketing site for “ENSO – Hạt khử mùi” into a VIP, premium, modern eco brand site. The site must look like an agency-built landing + product catalog hybrid optimized for conversion.

STACK
- Next.js 14+ App Router
- TypeScript
- TailwindCSS
- No external UI libraries (no shadcn, no MUI). Tailwind only.
- Use next/image for all images (use placeholders in /public).
- SEO via metadata in app/layout.tsx and per-page if needed.
- No backend. Order form is client-side (validation + success state). Optional: store order payload to localStorage for demo.

DELIVERABLES (return file tree + full contents)
- app/layout.tsx
- app/page.tsx
- app/globals.css
- components/*
  - Header.tsx
  - Hero.tsx
  - ProductGrid.tsx
  - CategoryFilter.tsx
  - ProductModal.tsx (or Drawer)
  - Benefits.tsx
  - UseCases.tsx
  - HowToUse.tsx
  - Testimonials.tsx
  - PricingCombo.tsx
  - OrderForm.tsx
  - FAQ.tsx
  - Footer.tsx
  - StickyMobileBar.tsx
- lib/products.ts (mock product data)
- tailwind.config.ts
- postcss.config.js

BRAND / STYLE (STRICT)
- Eco premium: clean white base + soft green accents. Avoid loud gradients.
- Palette:
  - Primary: emerald-600
  - Hover: emerald-700
  - Soft backgrounds: emerald-50, slate-50
  - Text: slate-900 / slate-600
- Layout: max-w-6xl, px-6, generous whitespace.
- Radius: rounded-2xl cards; rounded-xl buttons/inputs.
- Shadows: subtle (shadow-sm / shadow-md) only.
- Borders: slate-200.
- Typography: system font + optional Google font "Inter".
- Use tasteful inline SVG icons only (no icon libs).

INSPIRATION (do not copy; emulate feel)
- premium clean product landing, eco household brand, Apple-like spacing + Stripe-like clarity.

PAGE STRUCTURE (ONE PAGE, MULTI-PRODUCT)
1) Header (sticky, clean)
- Logo: ENSO (text)
- Nav anchors: Sản phẩm, Công dụng, Cách dùng, Combo, Đặt hàng, FAQ
- Right: Hotline button + “Mua ngay” button (scroll to order)
- On mobile: hamburger opens drawer with anchors

2) Hero (must look premium)
- H1: “Hạt khử mùi ENSO – Sạch mùi, thoáng khí, đơn giản mỗi ngày”
- Sub: dùng cho tủ giày, phòng, xe hơi, nhà vệ sinh, tủ quần áo…
- Primary CTA: “Xem sản phẩm” (scroll to product grid)
- Secondary CTA: “Chat Zalo”
- Add trust badges row (3–4):
  - “An toàn – dễ dùng”
  - “Không cần điện”
  - “Nhỏ gọn – đa dụng”
  - “Phù hợp gia đình”
- Right side: product hero image inside a premium card with 2-3 mini badges (eco, long-lasting, odor control)
- Background: subtle eco gradient + soft blob (minimal)

3) Social Proof strip
- Stars rating UI (SVG stars)
- “1.000+ khách hàng tin dùng” (placeholder)
- Small logos placeholders “Đối tác/Chứng nhận” (grey pills)

4) Product Catalog Section (KEY)
- Title: “Chọn sản phẩm phù hợp”
- Category filter pills:
  - Tất cả
  - Tủ giày
  - Nhà vệ sinh
  - Xe hơi
  - Tủ quần áo
  - Phòng ngủ
- Search input (client-side filter by name)
- Product grid: 8–12 products (mock data) with:
  - image
  - name
  - short benefit line
  - size/volume tag
  - price (formatted VND)
  - 2 buttons: “Xem nhanh” (open modal) + “Mua ngay” (scroll to order with selected product)
- Product Modal:
  - larger image
  - highlights bullets (3–5)
  - usage
  - price
  - CTA “Chọn sản phẩm này” (sets selection & scroll to order)

5) Benefits (4 cards)
- An toàn
- Hiệu quả lâu
- Dễ đặt – dễ dùng
- Đa dụng nhiều không gian
Each with icon + 2-line copy.

6) Use Cases (2x3 grid)
- cards with icon and short text for each place: tủ giày, toilet, xe hơi, tủ lạnh (optional), tủ áo, phòng.
Keep it clean.

7) How To Use (3 steps)
- Stepper style:
  1. Mở gói/đặt vào vị trí
  2. Chờ hấp thụ mùi
  3. Thay mới theo chu kỳ (placeholder)
Add small note: “Lưu ý: tuỳ môi trường…”

8) Combo / Pricing
- 3 combo cards:
  - Gói lẻ
  - Combo tiết kiệm (highlight “Bán chạy”)
  - Combo gia đình (best value)
- Each includes: what’s inside, price, savings line.
- CTA on each: “Chọn combo” -> set selected plan -> scroll to order.

9) Testimonials
- 6 review cards, Vietnamese names, location, short review, star rating.

10) Order Section (Conversion Focus)
- Two-column layout:
  - Left: trust & policies quick bullets
  - Right: OrderForm card
Order form fields:
  - Họ tên
  - Số điện thoại
  - Địa chỉ
  - Chọn sản phẩm/combo (pre-filled from selection)
  - Số lượng (1-10)
  - Ghi chú
Validation:
  - name >= 2
  - phone 10-11 digits
  - address >= 6
Submit:
  - show inline success banner (green) “Đã ghi nhận! ENSO sẽ gọi xác nhận.”
  - store payload in localStorage (optional)
  - reset form after success

11) FAQ (accordion)
- 6 items: dùng bao lâu, đặt ở đâu, có mùi không, thay khi nào, giao hàng, đổi trả.
Accordion in pure React state.

12) Footer
- Contact, address placeholder, hotline, zalo, social icons placeholders.

MOBILE STICKY BAR (IMPORTANT)
- Fixed bottom bar on mobile with 2 buttons:
  - “Gọi ngay” tel:HOTLINE
  - “Chat Zalo” open ZALO_URL
- Ensure it doesn’t cover content (add bottom padding).

DATA
Create mock product list in lib/products.ts:
- 10 products with:
  - id, name, category, shortDesc, highlights[], usage, sizeTag, priceVnd, image
- Use category tags matching filter.
- Format price with Intl.NumberFormat('vi-VN').

CONFIG CONSTANTS
- HOTLINE = "0900000000"
- ZALO_URL = "https://zalo.me/0900000000"

SEO
- metadata title/description in layout
- OpenGraph tags
- Add structured sections with semantic headings.

OUTPUT RULE
- Provide file tree + each file content.
- Code only. No extra explanations.
