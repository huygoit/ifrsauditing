// NOTE: Home page now supports dynamic categories from DB.
// Keep categories as strings to avoid coupling to a fixed union.
export type ProductCategory = string;

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  shortDesc: string;
  highlights: string[];
  usage: string;
  sizeTag: string;
  priceVnd: number;
  compareAtVnd?: number; // optional old price for premium card UI
  badge?: string;
  image: string;
  /** Sản phẩm nổi bật (tuỳ trang có hiển thị) */
  featured?: boolean;
};

export const CATEGORIES: ProductCategory[] = [
  "Tất cả",
  "Tủ giày",
  "Nhà vệ sinh",
  "Xe hơi",
  "Tủ quần áo",
  "Phòng ngủ"
];

export const PRODUCTS: Product[] = [
  {
    id: "enso-shoe-mini",
    name: "ENSO Shoe Mini",
    category: "Tủ giày",
    shortDesc: "Khử mùi giày nhanh, nhẹ mùi và thoáng không gian.",
    highlights: ["Nhỏ gọn để trong giày/tủ", "Giảm mùi ẩm mốc", "Dễ thay mới", "Không cần điện"],
    usage: "Đặt 1 gói/1 đôi giày hoặc 1–2 gói trong ngăn tủ giày. Thay mới theo chu kỳ tuỳ môi trường.",
    sizeTag: "Gói 50g",
    priceVnd: 69000,
    compareAtVnd: 89000,
    badge: "Best seller",
    image: "/products/product-01.jpg"
  },
  {
    id: "enso-shoe-plus",
    name: "ENSO Shoe Plus",
    category: "Tủ giày",
    shortDesc: "Tăng lực hấp thụ mùi cho tủ giày gia đình.",
    highlights: ["Phù hợp tủ lớn", "Giữ không gian khô thoáng", "Ít phải thay hơn", "An toàn cho gia đình"],
    usage: "Đặt 2–3 gói trong tủ giày. Tránh để trực tiếp dưới nước.",
    sizeTag: "Gói 100g",
    priceVnd: 99000,
    badge: "Best seller",
    image: "/products/product-02.jpg"
  },
  {
    id: "enso-toilet-fresh",
    name: "ENSO Toilet Fresh",
    category: "Nhà vệ sinh",
    shortDesc: "Giảm mùi khó chịu, giữ nhà vệ sinh sạch cảm giác.",
    highlights: ["Hỗ trợ kiểm soát mùi", "Không át mùi nồng", "Đặt kín đáo", "Dễ dùng mỗi ngày"],
    usage: "Đặt ở góc khô thoáng hoặc kệ cao. Thay mới khi hiệu quả giảm.",
    sizeTag: "Hộp 120g",
    priceVnd: 129000,
    compareAtVnd: 159000,
    badge: "-20%",
    image: "/products/product-03.jpg"
  },
  {
    id: "enso-car-clip",
    name: "ENSO Car Clip",
    category: "Xe hơi",
    shortDesc: "Nhỏ gọn cho xe hơi: sạch mùi, dễ chịu khi di chuyển.",
    highlights: ["Thiết kế gọn", "Hỗ trợ giảm mùi nội thất", "Không gây rối mắt", "Không cần cắm điện"],
    usage: "Đặt ở hộc để đồ hoặc ngăn cửa xe. Tránh nắng trực tiếp quá lâu.",
    sizeTag: "Gói 60g",
    priceVnd: 89000,
    image: "/products/product-04.jpg"
  },
  {
    id: "enso-car-max",
    name: "ENSO Car Max",
    category: "Xe hơi",
    shortDesc: "Cho xe rộng/đi nhiều: hiệu quả ổn định hơn.",
    highlights: ["Dung lượng lớn hơn", "Duy trì lâu hơn", "Phù hợp gia đình", "Dễ thay mới"],
    usage: "Đặt 1 gói ở cốp hoặc dưới ghế. Thay mới theo chu kỳ.",
    sizeTag: "Gói 120g",
    priceVnd: 139000,
    compareAtVnd: 169000,
    badge: "-20%",
    image: "/products/product-05.jpg"
  },
  {
    id: "enso-wardrobe-slim",
    name: "ENSO Wardrobe Slim",
    category: "Tủ quần áo",
    shortDesc: "Giữ tủ áo thơm sạch cảm giác, hạn chế mùi ẩm.",
    highlights: ["Gọn cho ngăn kéo", "Giảm mùi quần áo", "Hợp phòng máy lạnh", "An toàn, dễ dùng"],
    usage: "Đặt 1–2 gói/1 ngăn. Tránh tiếp xúc trực tiếp với vải ướt.",
    sizeTag: "Gói 80g",
    priceVnd: 99000,
    image: "/products/product-06.jpg"
  },
  {
    id: "enso-wardrobe-box",
    name: "ENSO Wardrobe Box",
    category: "Tủ quần áo",
    shortDesc: "Phiên bản hộp: đặt ổn định, tối giản thẩm mỹ.",
    highlights: ["Thiết kế premium", "Đặt chắc chắn", "Không bừa bộn", "Giữ không gian tủ dễ chịu"],
    usage: "Đặt trên kệ/đáy tủ. Thay mới khi mùi xuất hiện trở lại.",
    sizeTag: "Hộp 150g",
    priceVnd: 159000,
    badge: "Best seller",
    image: "/products/product-07.jpg"
  },
  {
    id: "enso-bedroom-calm",
    name: "ENSO Bedroom Calm",
    category: "Phòng ngủ",
    shortDesc: "Tạo cảm giác thoáng khí, nhẹ mùi cho phòng ngủ.",
    highlights: ["Không gian dễ chịu", "Nhẹ nhàng, không nồng", "Dễ bố trí", "Phù hợp gia đình"],
    usage: "Đặt gần tủ đầu giường/kệ khô thoáng. Tránh nơi ẩm ướt.",
    sizeTag: "Hộp 180g",
    priceVnd: 179000,
    image: "/products/product-08.jpg"
  },
  {
    id: "enso-room-boost",
    name: "ENSO Room Boost",
    category: "Phòng ngủ",
    shortDesc: "Tăng hiệu quả cho phòng lớn hoặc dùng chung nhiều khu vực.",
    highlights: ["Dung lượng lớn", "Duy trì lâu", "Đa dụng", "Tối giản thẩm mỹ"],
    usage: "Đặt 1 hộp ở góc phòng. Thay mới theo chu kỳ tuỳ môi trường.",
    sizeTag: "Hộp 250g",
    priceVnd: 229000,
    image: "/products/product-09.jpg"
  },
  {
    id: "enso-fresh-kit",
    name: "ENSO Fresh Kit",
    category: "Nhà vệ sinh",
    shortDesc: "Bộ cơ bản cho nhiều góc: toilet + tủ giày + xe hơi.",
    highlights: ["Phủ nhiều không gian", "Tiện lợi dùng ngay", "Tiết kiệm hơn mua lẻ", "Phù hợp gia đình"],
    usage: "Chia từng gói theo từng khu vực. Thay mới theo chu kỳ.",
    sizeTag: "Bộ 3 gói",
    priceVnd: 249000,
    compareAtVnd: 309000,
    badge: "Combo tiết kiệm",
    image: "/products/product-10.jpg"
  }
];


