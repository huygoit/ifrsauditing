You are a senior UI/UX designer + Next.js engineer. Upgrade an existing Next.js App Router + Tailwind eco green multi-product landing/catalog (ENSO hạt khử mùi) to “VIP PRO MAX” while KEEPING the current structure and content. Do NOT rewrite everything from scratch; refactor and enhance.

CONTEXT (existing baseline)
- One-page site with sections: Header, Hero, Social Proof, Product Catalog (filter + search + grid), Benefits, Use Cases, HowToUse, Pricing/Combos, Testimonials, Order Form, FAQ, Footer, Sticky Mobile Bar.
- Product data in lib/products.ts, selection flows to OrderForm.
- Static export friendly (next.config output: 'export', images unoptimized).

GOAL (VIP PRO MAX)
Enhance perceived quality + mobile shopping UX using:
1) Micro-interactions: hover lift, button press, subtle transitions, focus rings.
2) Scroll reveal: fade-in + slight translate for sections when entering viewport (no heavy libs).
3) Background pattern system: subtle eco patterns and gradients for hero/pricing/testimonials without hurting readability.
4) Product Quick-View Drawer on mobile: bottom sheet drawer that shows product details and a “Chọn sản phẩm” CTA.
5) Keep performance: no heavy animation libraries, no icon libraries.

STACK / RULES
- Next.js 14+ App Router, TS, Tailwind.
- No shadcn/MUI/Framer/GSAP. Use Tailwind + small hooks only.
- Static export compatible: avoid server actions, avoid API routes.
- Use <img> for product images (static export friendly). (Optional: next/image only if unoptimized and works.)
- Maintain existing component boundaries and file tree where possible. Add new components/hooks only as needed.

DELIVERABLES
Return file tree and full contents for modified/new files.
- Modify existing components, do not delete baseline sections.
- Add:
  - hooks/useInView.ts (IntersectionObserver)
  - components/Reveal.tsx (wrap sections for fade-in)
  - components/PatternBg.tsx (reusable background patterns)
  - components/ProductDrawer.tsx (mobile quick-view drawer)
  - components/Button.tsx (optional shared button styles)
  - styles for focus states in globals.css if needed

VIP PRO MAX DESIGN SYSTEM (STRICT)
- Whitespace: generous; section padding py-16 md:py-24
- Cards: rounded-2xl, border-slate-200, shadow-sm, hover:shadow-md
- Hover lift: hover:-translate-y-1 on cards (only where appropriate)
- Buttons: transition-all, active:scale-[0.98], focus-visible:ring-2 ring-emerald-500
- Text hierarchy:
  - H1: text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]
  - H2: text-2xl md:text-3xl font-semibold
  - Body: text-base leading-7 text-slate-600
- Palette: emerald-600 primary, emerald-700 hover, emerald-50 soft backgrounds, slate neutrals
- Patterns: extremely subtle, opacity <= 0.08, never reduce contrast.

MICRO-INTERACTIONS (IMPLEMENT)
- Cards: hover lift + shadow, smooth transitions
- Buttons: hover color shift + slight shadow, active press scale
- Inputs: focus ring, error state border-red-400, shake or subtle highlight on invalid submit (optional)
- Nav: active section highlight on scroll (optional light)

SCROLL REVEAL (IMPLEMENT)
- Create <Reveal> wrapper using IntersectionObserver.
- When in view: transition from opacity-0 translate-y-3 to opacity-100 translate-y-0
- Must respect prefers-reduced-motion (disable animations if user prefers reduced motion).

BACKGROUND PATTERN SYSTEM (IMPLEMENT)
- Create <PatternBg variant="hero|pricing|testimonials"> that renders:
  - subtle radial gradient + soft blob + dotted grid or leaf-like abstract svg pattern
  - Use pure CSS or inline SVG with very low opacity
- Apply to hero and pricing sections. Optionally to testimonials.

PRODUCT QUICK-VIEW DRAWER (MOBILE) (IMPLEMENT)
- On product card:
  - Desktop: keep existing modal quick view (if exists) OR upgrade to nicer modal.
  - Mobile: use bottom drawer (sheet) that slides up.
- Drawer content:
  - product image, name, price, sizeTag
  - highlights bullets (3-5)
  - usage short
  - CTA: “Chọn sản phẩm này” -> sets selected product -> closes drawer -> scrolls to Order section
- Drawer behavior:
  - Open from bottom with backdrop
  - Close by X button + tapping backdrop + swipe down (optional simple)
  - Trap focus for accessibility (simple: focus first button and restore on close)
- Do not use external libraries. Keep code clean.

CATALOG UX UPGRADES (KEEP FEATURES, IMPROVE LOOK)
- Category pills: add subtle animation, active pill style
- Search: add icon (inline svg), clear button
- Product card:
  - add “Phù hợp: …” micro tag
  - show savings badge if product has discount (optional from data)
- Add “Compare” not needed. Keep simple.

ORDER FLOW (ENHANCE)
- When user selects product/combo:
  - show a small “Đã chọn: …” chip above form
  - smooth scroll to form
- Success banner: nicer inline card with icon and summary
- Still no backend.

ACCESSIBILITY + RESPONSIVE
- Must look excellent on mobile: spacing, sticky bar, drawer interactions.
- Add bottom padding to body/content so sticky bar doesn’t cover CTA.

SEO
- Keep metadata in layout; ensure headings are semantic.
- OpenGraph values (title/description).

OUTPUT FORMAT
- Provide only code: file tree + file contents.
- No extra explanations.

NOTE
- Keep the existing site’s structure and copy. Only refine copy where needed for clarity and premium feel.
- Ensure everything works with static export.
