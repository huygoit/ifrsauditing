/** @type {import('tailwindcss').Config} */

// Bảng màu thương hiệu IFRS Auditing — bám sát logo (xanh forest + đỏ accent)
// Mục tiêu: tone sáng – pro – có chiều sâu cho gradient. Scale 50→950 tương thích Tailwind.
const brand = {
  50: "#ECFDF3",
  100: "#D1FAE0",
  200: "#A6F4BD",
  300: "#6FE599",
  400: "#36CD6C",
  500: "#16B14C", // CTA chính, vibrant
  600: "#0F9540", // gần màu logo
  700: "#0B7833", // chữ trên nền sáng
  800: "#0A5F2A",
  900: "#084924",
  950: "#052E16"
};

// Đỏ accent — dùng cho gạch chân, badge nhấn, không lạm dụng
const accent = {
  50: "#FEF2F2",
  100: "#FEE2E2",
  200: "#FCC8C8",
  300: "#F8A5A5",
  400: "#E96A6A",
  500: "#DC3A3A",
  600: "#C42626", // đỏ logo
  700: "#A41B1B",
  800: "#871717",
  900: "#6B1414",
  950: "#3F0808"
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
        // Gradient CTA sáng → đậm, dùng cho nút primary / banner nhấn
        "brand-gradient": "linear-gradient(135deg, #22C55E 0%, #16B14C 45%, #0B7833 100%)",
        // Gradient nền section nhẹ — không gắt mắt, ổn cho hero phụ
        "brand-gradient-soft": "linear-gradient(180deg, #ECFDF3 0%, #FFFFFF 100%)",
        // Quầng sáng radial cho hero/decoration
        "brand-glow":
          "radial-gradient(60% 60% at 50% 40%, rgba(22,177,76,0.35) 0%, rgba(22,177,76,0) 70%)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
        // Đổ bóng tone brand cho nút/CTA — “glow” pro nhưng không chói
        brand: "0 12px 30px -10px rgba(15,149,64,0.45), 0 4px 10px -4px rgba(11,120,51,0.25)"
      }
    }
  },
  plugins: []
};
