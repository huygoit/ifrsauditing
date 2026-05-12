Bạn là Senior Frontend + UI Engineer (CRO mindset).
Nhiệm vụ: nâng cấp giao diện landing page ENSO theo phong cách “VIP PRO MAX” nhưng GIỮ NGUYÊN cấu trúc section, dữ liệu và cách xử lý ảnh sản phẩm hiện tại.

Mục tiêu:
- Giao diện premium hơn, thoáng hơn
- Tăng tỉ lệ click “Mua ngay” và chọn combo
- Đồng bộ design system, cải thiện trải nghiệm đọc & mua
- Không phá logic hiện có

=== NGUYÊN TẮC CHUNG (BẮT BUỘC) ===
1) Giữ nguyên flow section:
   Header → Hero → Trust/Partner → Product Filter + Grid → Công dụng → Dùng được ở đâu → Cách dùng → Combo/Pricing → Video → Reviews → Order Form → FAQ → Footer
2) KHÔNG chỉnh sửa, KHÔNG can thiệp vào nội dung/ảnh sản phẩm hiện tại (badge, sale đã được xử lý đúng).
3) Chỉ tập trung nâng cấp: layout, spacing, typography, CTA hierarchy, hover/motion, visual balance.
4) Responsive mobile-first, không để section nào bị chật hoặc quá dài trên mobile.
5) Accessibility: contrast tốt, focus rõ, clickable area lớn, font body ≥ 14px.

=== DESIGN SYSTEM (ÁP TOÀN SITE) ===
- Container: max-width 1200px
  - Padding: 16px (mobile) / 24px (tablet) / 32px (desktop)
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Border radius:
  - Card: 16px
  - Button / Chip: 999px
- Shadow: soft shadow-sm / shadow-md (không gắt)
- Border: 1px solid neutral-200, hover → neutral-300
- Typography:
  - H1: 40–48px desktop, 30–34px mobile, line-height 1.15
  - H2 (section): 28–32px desktop, 22–24px mobile
  - Body: 14–16px, line-height 1.6
  - Meta text: 12–13px
- Màu:
  - Giữ nguyên màu thương hiệu hiện tại
  - Chỉ dùng thêm neutral + 1 accent nhẹ nếu cần
- Motion:
  - Hover lift nhẹ (translateY -2px + shadow-md)
  - Fade/slide-in khi scroll (IntersectionObserver)
  - Transition 200–250ms ease-out

=== HEADER / NAV ===
- Thêm top-bar mỏng hiển thị lợi ích: “COD • Giao nhanh • Đổi trả • Tư vấn”
- Header sticky khi scroll
- CTA “Mua ngay” trong header nổi bật nhất
- Mobile: menu gọn, CTA luôn dễ bấm

=== HERO SECTION (TỐI ƯU CHUYỂN ĐỔI) ===
- Giữ layout 2 cột (text trái – hình phải)
- Tối ưu hierarchy nội dung:
  1) Headline tập trung vào lợi ích chính
  2) Subheadline nói rõ tình huống sử dụng
  3) 3 bullet lợi ích ngắn + icon
  4) CTA row:
     - Primary: “Mua ngay”
     - Secondary: “Xem combo tiết kiệm”
  5) Proof row nhỏ: rating / đối tác / chứng nhận
- Khoảng trắng rộng hơn, text dễ đọc hơn
- Hình hero hiển thị full khung, không khoảng trắng thừa

=== TRUST / PARTNER STRIP ===
- Chuẩn hoá thành trust cards đồng bộ:
  - Logo + title ngắn + mô tả 1 dòng
- Desktop hiển thị ngang hàng
- Mobile chuyển sang carousel nhẹ
- Tạo cảm giác “bằng chứng” chứ không chỉ trang trí

=== PRODUCT FILTER + GRID ===
- Filter bar:
  - Thêm sort dropdown: Bán chạy / Mới / Giá
  - Filter chip dạng pill, thể hiện rõ trạng thái đang lọc
  - Quick filter 1 chạm (Ô tô / Tủ giày / WC / Combo)
- Grid:
  - Card đồng chiều cao
  - Desktop 3–4 cột, tablet 2 cột, mobile 1 cột
  - Hover rõ ràng nhưng nhẹ

=== PRODUCT CARD (CHỈ NÂNG UI/UX) ===
- Giữ nguyên nội dung và badge hiện tại
- Chuẩn hoá layout trong card:
  - Title 1 dòng (truncate)
  - Meta gọn, không quá 2 dòng
  - Price row rõ ràng, phân cấp tốt
  - CTA “Mua ngay” full-width, nổi bật
  - Secondary link “Xem chi tiết” nhẹ
- Toàn card có thể click (trừ CTA)
- Hover: lift + shadow nhẹ

=== CÁC SECTION GIẢI THÍCH (CÔNG DỤNG / CÁCH DÙNG) ===
- Mỗi section:
  - Title + subtitle ngắn
  - Grid 3–4 card/icon đồng bộ
  - Text ngắn, dễ quét
- Có thể thêm background nhạt hoặc divider để tách section rõ hơn

=== COMBO / PRICING (TĂNG AOV) ===
- 3 gói, gói giữa highlight rõ “Tiết kiệm nhất”
- Hiển thị lợi ích kinh tế rõ ràng
- CTA trong từng gói: “Chọn gói này”
- Trust bullets ngay trong card (COD, đổi trả, hỗ trợ)

=== VIDEO SECTION ===
- 1 video chính + 2 video phụ
- Title theo pain-point người dùng
- Thumbnail đồng bộ, nút play rõ

=== REVIEWS ===
- Header reviews: ⭐ rating trung bình + tổng số đánh giá
- Review card:
  - Tình huống sử dụng
  - Tên + địa phương (nếu có)
- Spacing thoáng, dễ đọc

=== ORDER FORM (CHỐT ĐƠN) ===
- Desktop: form + order summary 2 cột
- Mobile: form trước, summary sau
- Dưới nút submit hiển thị trust line
- Validate rõ, error thân thiện
- CTA “Mua ngay” scroll xuống form

=== FAQ ===
- Accordion gọn, spacing thoáng
- Highlight 5 câu hỏi phổ biến

=== KỸ THUẬT ===
- Dùng TailwindCSS hoặc hệ thống CSS hiện có
- Tối ưu ảnh (lazyload)
- Animation nhẹ, không làm chậm site
- SEO & semantic chuẩn

=== OUTPUT ===
- Cập nhật UI trực tiếp trong codebase hiện tại
- Ưu tiên chỉnh: Hero, ProductCard, FilterBar, Pricing
- Không thay đổi dữ liệu, logic, xử lý ảnh
- Trả về diff rõ ràng theo component/file
