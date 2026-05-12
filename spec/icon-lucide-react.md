Refactor toàn bộ icon trong section “Công dụng nổi bật” + “Không gian sử dụng” sang Lucide Icons.

Yêu cầu chung:
- Sử dụng thư viện lucide-react
- Chỉ dùng icon dạng outline (stroke-based) để đồng bộ style
- Mỗi icon cùng kích thước 24px (class: w-6 h-6)
- Icon đặt trong container 48x48px (w-12 h-12), bo góc (rounded-xl)
- Nền nhẹ (bg-emerald-50) + icon màu brand (text-emerald-700)
- Không dùng PNG/icon image, chỉ dùng Lucide component
- Hover nhẹ: icon scale 1.05 + shadow nhẹ cho card (premium, không lố)
- Đồng bộ spacing, align, và responsive (grid 2 cột mobile, 3-6 cột desktop tùy layout)

A) Mapping icon cho “Công dụng nổi bật”:
- An toàn → ShieldCheck
- Hiệu quả → Zap (hoặc Gauge nếu hợp hơn với tone)
- Dễ đặt – dễ dùng → MousePointerClick
- Đa dụng nhiều không gian → LayoutGrid

B) Mapping icon cho “Không gian sử dụng” (mỗi mục phải có icon tương ứng):
- Tủ giày → Shoe (nếu không có Shoe trong Lucide thì dùng Footprints)
  Text: “Giảm mùi ẩm mốc, giữ góc giày sạch cảm giác.”
- Nhà vệ sinh → Toilet (nếu không có Toilet thì dùng Droplets hoặc Bath)
  Text: “Hỗ trợ kiểm soát mùi, không át mùi nồng.”
- Xe hơi → Car
  Text: “Dễ chịu khi di chuyển, gọn gàng trong cabin.”
- Tủ quần áo → Shirt
  Text: “Hạn chế mùi ẩm, giúp tủ áo thoáng hơn.”
- Phòng ngủ → BedDouble (nếu không có BedDouble thì dùng Bed)
  Text: “Tạo cảm giác trong lành, nhẹ mùi.”
- Không gian đa dụng → Layers (hoặc Grid3X3 / Boxes)
  Text: “Góc bếp/đồ dùng (placeholder), linh hoạt.”

C) Implementation notes:
- Tạo mảng data cho 2 section (benefits + spaces) gồm: title, description, icon component.
- Render bằng map để dễ chỉnh sửa, dễ thêm/bớt item.
- Đảm bảo icon baseline thẳng hàng, heading/description typography rõ ràng.
- Nếu một icon name không tồn tại trong lucide-react, tự động fallback sang icon gần nghĩa nhất (đúng mapping ưu tiên ở trên).
