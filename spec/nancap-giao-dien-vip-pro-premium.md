Bạn là Senior Frontend + UI Engineer (CRO mindset). 
Nhiệm vụ: nâng cấp giao diện landing page ENSO theo phong cách “VIP PRO MAX” nhưng GIỮ NGUYÊN cấu trúc/section hiện tại và dữ liệu. 
Mục tiêu: nhìn premium hơn, rõ ràng hơn, tăng tỉ lệ bấm “Mua ngay”, giảm rối thị giác, đồng bộ design system.

=== NGUYÊN TẮC CHUNG (bắt buộc) ===
1) Không đổi flow section: Header -> Hero -> Trust/Partner -> Product filter + grid -> Công dụng -> Dùng được ở đâu -> Cách dùng -> Combo/Pricing -> Video -> Reviews -> Order form -> FAQ -> Footer
2) Không nhét text/khuyến mãi trực tiếp vào ảnh sản phẩm nữa. Tất cả sale/bán chạy/chứng nhận phải dùng UI badge overlay (top-left/top-right) hoặc metadata trong card.
3) Làm UI premium: spacing thoáng, typography rõ, shadow mềm, radius đồng bộ, micro-interactions nhẹ.
4) Đảm bảo responsive chuẩn mobile-first, mọi section không bị “chật” trên mobile.
5) Ưu tiên accessibility: contrast tốt, focus ring rõ, clickable area lớn, font-size body >= 14px.

=== DESIGN SYSTEM (áp vào toàn site) ===
- Container: max-width 1200px, padding ngang: 16px (mobile), 24px (tablet), 32px (desktop)
- Spacing scale: 4/8/12/16/24/32/48/64
- Border radius: 16px cho card, 999px cho pill button/chip
- Shadow: soft (shadow-sm/ shadow-md), không dùng shadow gắt
- Border: 1px solid neutral-200, hover lên neutral-300
- Typography:
  - H1: 40-48px desktop, 30-34px mobile, line-height 1.1-1.2
  - H2 section: 28-32px desktop, 22-24px mobile
  - Body: 14-16px, line-height 1.6
  - Meta text: 12-13px
- Màu:
  - Primary: xanh thương hiệu hiện tại (giữ nguyên)
  - Neutral: trắng + xám nhạt (bg), text xám đậm
  - Accent nhẹ (nếu cần) chỉ dùng cho badge (ví dụ “Best seller”, “-20%”)
- Motion:
  - Hover lift: translateY(-2px) + shadow-md
  - Fade-in khi scroll (IntersectionObserver), duration 250-350ms
  - Transition: 200ms ease-out

=== HEADER/NAV (tối ưu conversion) ===
- Thêm top-bar mỏng: “COD toàn quốc • Giao nhanh • Đổi trả nếu lỗi • Hỗ trợ tư vấn”
- Header sticky khi scroll.
- CTA trong header: nút Primary “Mua ngay” (pill), luôn nổi bật.
- Mobile: menu gọn, CTA vẫn dễ bấm.

=== HERO (điểm ăn tiền) ===
- Giữ layout 2 cột: trái text, phải hình.
- Tối ưu content layout:
  1) Headline mạnh (lợi ích chính): “Hạt khử mùi ENSO – Sạch mùi nhanh, không hắc, dùng mọi không gian”
  2) Subheadline: 1-2 câu nói rõ tình huống (tủ giày/ô tô/WC/phòng)
  3) 3 bullet lợi ích + icon (nhỏ, gọn)
  4) CTA row:
     - Primary: “Mua ngay”
     - Secondary: “Xem combo tiết kiệm”
  5) Proof row nhỏ dưới CTA:
     - Rating (⭐ 4.8/5), số review
     - Logo đối tác (ACV/đối tác)
     - Chứng nhận/Eco
- Hình hero: full-bleed trong khung, không khoảng trắng thừa, có background gradient rất nhẹ.


=== PRODUCT CARD (sửa mạnh để premium) ===
- Trên card:
  - Badge overlay góc trên: “Best seller”, “-20%”, “Combo tiết kiệm”
  - Title 1 dòng (truncate)
  - Meta 1 dòng: “Dùng cho: …”
  - Price row rõ ràng: giá hiện tại + giá gạch + tiết kiệm %
  - CTA:
    - Primary: “Mua ngay” full-width
    - Secondary text link: “Xem chi tiết”
- Hover: card nâng nhẹ + shadow tăng.
- Clickable: toàn card click vào detail (trừ CTA).
- Loading skeleton khi fetch.

=== SECTION “CÔNG DỤNG / DÙNG ĐƯỢC Ở ĐÂU / CÁCH DÙNG” ===
- Mỗi section:
  - Title + subtitle ngắn
  - Grid card 3-4 item, icon đồng bộ
  - Không để text dài; tối đa 2 dòng/ item, có “Xem thêm” nếu dài.
- Tăng visual: thêm subtle background pattern/gradient rất nhẹ phía sau section (không gây rối).

=== COMBO / PRICING (tăng AOV) ===
- 3 gói:
  - Gói giữa highlight rõ: “Tiết kiệm nhất”
  - Hiển thị “Tiết kiệm X% so với mua lẻ”
  - Bullet trust trong card: COD, đổi trả, tư vấn
  - CTA: “Chọn gói này”
- Nếu có thể: sticky “mini summary” khi user chọn gói.


=== REVIEWS (tăng trust) ===
- Trên đầu reviews: rating summary (⭐ 4.8/5 • xxx đánh giá).
- Review card:
  - Tag tình huống: “Tủ giày/Ô tô/WC”
  - Tên + địa phương + ngày
- có ảnh khách: hiển thị dạng mini gallery.

=== ORDER FORM (chốt đơn) ===
- Bố cục 2 cột desktop: form + order summary.
- Dưới nút đặt: trust line “✅ COD • ✅ Giao nhanh • ✅ Đổi trả nếu lỗi • ✅ Bảo mật”
- Validate input rõ ràng, error message thân thiện.
- Auto-scroll tới form khi bấm CTA “Mua ngay”.

=== FAQ ===
- Accordion sạch, icon, spacing thoáng.
- Thêm “Câu hỏi phổ biến” top 5.

=== KỸ THUẬT (bắt buộc) ===
- Dùng TailwindCSS (hoặc hệ thống CSS hiện có) theo design tokens ở trên.
- Tối ưu ảnh: dùng webp/avif nếu có, lazyload.
- Không làm nặng site: animation nhẹ, hạn chế thư viện.
- Đảm bảo SEO: heading hierarchy đúng, button/link semantics chuẩn.

=== OUTPUT YÊU CẦU ===
1) Cập nhật UI theo các mục trên bằng code trực tiếp trong project.
2) Không phá dữ liệu/logic hiện có, chỉ nâng cấp trình bày + UX.

Bắt đầu từ: HERO + PRODUCT CARD + FILTER BAR + PRICING.
