/** @type {import('tailwindcss').Config} */

// Bảng màu thương hiệu IFRS Auditing — tone teal/slate trầm, sang (theo brief khách).
// Neo: 600 #124E66 (teal chủ đạo), 800 #2E3944, 900 #212A31 (slate tối), 100 #D3D9D4 (sage nhạt),
// 400 #748D92 (xám xanh). Các bậc còn lại nội suy để đủ scale 50→950 tương thích Tailwind.
const brand = {
  50: "#F1F4F4",
  100: "#D3D9D4", // sage nhạt — nền section sáng
  200: "#B7C4C6",
  300: "#94ABAF",
  400: "#748D92", // xám xanh — chữ phụ, viền
  500: "#3F6F80",
  600: "#124E66", // teal chủ đạo — CTA, link, nhấn
  700: "#103F54",
  800: "#2E3944", // slate than — surface tối, heading đậm
  900: "#212A31", // gunmetal — nền tối nhất
  950: "#161D22"
};

// Đơn sắc: accent dùng chung tone teal (đã bỏ đỏ). Giữ key để class accent-* không vỡ.
const accent = {
  50: "#F1F4F4",
  100: "#D3D9D4",
  200: "#B7C4C6",
  300: "#94ABAF",
  400: "#748D92",
  500: "#1E6A87",
  600: "#124E66",
  700: "#103F54",
  800: "#2E3944",
  900: "#212A31",
  950: "#161D22"
};

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand,
        accent,
        // Override emerald = brand: mọi class emerald-* hiện có tự lên tone logo,
        // tránh phải refactor hàng trăm component.
        emerald: brand
      },
      backgroundImage: {
        // Gradient CTA teal: sáng → đậm, dùng cho nút primary / banner nhấn
        "brand-gradient": "linear-gradient(135deg, #1E6A87 0%, #124E66 50%, #103F54 100%)",
        // Gradient nền section nhẹ — sage rất nhạt → trắng
        "brand-gradient-soft": "linear-gradient(180deg, #EDF1F1 0%, #FFFFFF 100%)",
        // Quầng sáng radial teal cho hero/decoration
        "brand-glow":
          "radial-gradient(60% 60% at 50% 40%, rgba(18,78,102,0.35) 0%, rgba(18,78,102,0) 70%)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
        // Đổ bóng tone teal cho nút/CTA — “glow” pro nhưng không chói
        brand: "0 12px 30px -10px rgba(18,78,102,0.45), 0 4px 10px -4px rgba(16,63,84,0.3)"
      }
    }
  },
  plugins: []
};
