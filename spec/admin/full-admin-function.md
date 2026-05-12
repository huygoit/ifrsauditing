You are building an ENSO Admin panel INSIDE the SAME Next.js App Router project that already contains the public landing pages. Implement an /admin area with VIP PRO UX (minimal clicks) to manage the content powering the frontend.

PROJECT CONTEXT
- Existing public site in /app (landing/catalog sections).
- Add admin under /app/admin/* (do not break public routes).
- Use a separate admin layout: /app/admin/layout.tsx.
- Keep public site static-export friendly; admin can be server-rendered.

TECH STACK (STRICT)
- Next.js 14+ App Router (same project)
- TypeScript
- TailwindCSS (NO external UI libs: no shadcn, no MUI)
- Prisma ORM + MySQL
- Zod validation
- Auth: username/password, session cookie stored in DB (User + Session tables)
- Admin APIs: Next.js Route Handlers under /app/api/admin/*
- Uploads: local filesystem to /public/uploads for now, behind a StorageService interface
- Multi-language: Approach 1 (translation tables). Admin language switch via query param ?lang=vi|en, fallback to vi if missing.

MOST IMPORTANT UX GOALS
- Extremely easy: few clicks, fast editing.
- Every entity is managed from list pages with:
  - Quick Edit Drawer (right slide-over) for Create/Edit
  - Inline status toggles
  - Bulk actions
  - Reorder controls
- Global search + command palette (Ctrl/Cmd+K) to jump and create.
- Consistent design system: eco-premium (emerald accent), generous spacing, rounded-2xl, subtle shadows.
- Great empty states + skeleton loading.

ADMIN ROUTES (inside same project)
- /admin/login
- /admin (dashboard)
- /admin/categories
- /admin/products
- /admin/combos
- /admin/certifications
- /admin/partners
- /admin/videos
- /admin/posts
- /admin/reviews
- /admin/orders (feature toggle in settings; still implement)
- /admin/settings
- /admin/users
- /admin/audit

MODULES (12 FUNCTIONS)
1) Dashboard
- KPIs: new orders, top selected products, pending reviews, published posts this month
- Quick actions: add product/cert/video/post

2) Categories (Use cases)
- Base: iconKey, sortOrder, status
- Translations: name, description
- Reorder in list

3) Products
- Base: categoryId, priceVnd, salePriceVnd?, sizeTag, badges[], status, featured, sortOrder
- Images: thumbnail + gallery (ProductImage)
- Translations: name, shortDesc, highlights[], usage, seoTitle, seoDesc
- List filters: category/status/featured/search

4) Combos/Pricing
- Base: priceVnd, salePriceVnd?, badge, status, sortOrder
- Translations: title, subtitle, includes[], savingsLine, seoTitle, seoDesc
- ComboItems join to products (many-to-many)

5) Certifications/Awards
- Base: type (CERTIFICATION|AWARD), logoSrc, certificateImageSrc, issuedDate?, issuer?, status, sortOrder
- Translations: title, description, note
- Gallery/list toggle + modal preview

6) Partners
- Base: logoSrc, link?, group (PARTNER|DISTRIBUTOR|CUSTOMER), status, sortOrder
- Translations: name, shortDesc

7) Videos
- Base: type (YOUTUBE|MP4), src, thumbnailSrc, duration, placement (VIDEO_PROOF|HOW_TO_USE|OTHER), status, sortOrder
- Translations: title, caption
- Preview modal (lazy embed on open)

8) Posts/News
- Base: coverImage, author, publishedAt, status (DRAFT|PUBLISHED|SCHEDULED), tags[], sortOrder
- Translations: title, excerpt, contentMarkdown, seoTitle, seoDesc, slug (unique per lang)
- Editor: markdown + live preview

9) Reviews
- Base: rating 1-5, avatar?, location?, status (PENDING|APPROVED|HIDDEN), createdAt
- Translations: name, content
- Moderation queue with one-click approve/hide + bulk actions
- Simple spam/profanity heuristics

10) Orders/Leads
- Base: name, phone, address, productId?, comboId?, quantity, note, status (NEW|CALLING|CONFIRMED|CANCELED), internalNote, createdAt
- List: quick status change, tel: call button, export CSV

11) Site Settings
- Single record with:
  - hotline, zaloUrl, address, socialLinks
  - topBarMessage (translatable)
  - shippingPolicy (translatable)
  - returnPolicy (translatable)
  - seoDefaults per lang
  - ordersEnabled boolean
- Right side preview panel

12) Users & Roles + Audit Log
- Roles: ADMIN, EDITOR, CSKH
- Permissions:
  - ADMIN all
  - EDITOR content modules
  - CSKH orders + reviews
- AuditLog: who changed what, entity, timestamp, diff summary

MULTI-LANGUAGE UX (REQUIRED)
- Language switch in top bar (VI/EN) controlling ?lang
- In every edit drawer:
  - Show translation fields for selected language
  - If EN missing, show “Fallback: VI” indicator + button “Copy VI → EN”
  - Completion chips: “EN thiếu” / “Đủ EN”

DATABASE (PRISMA + MYSQL)
Provide prisma/schema.prisma with indexes and relations:
- Category + CategoryTranslation
- Product + ProductTranslation + ProductImage
- Combo + ComboTranslation + ComboItem
- Certification + CertificationTranslation
- Partner + PartnerTranslation
- Video + VideoTranslation
- Post + PostTranslation
- Review + ReviewTranslation
- Order
- Setting + SettingTranslation
- User + Session
- AuditLog

ADMIN UI COMPONENTS (build small internal design system)
- AdminShell (sidebar + topbar)
- DataTable (filters, sorting, row actions, bulk selection)
- QuickEditDrawer (shared drawer form container)
- FormField components + validation
- FileUploader (drag/drop + preview)
- Toast system
- CommandPalette (Ctrl/Cmd+K)
- StatusPill, BadgePill
- ConfirmDialog
- Skeletons

SECURITY & MIDDLEWARE
- Protect /admin routes using middleware.ts:
  - allow /admin/login
  - redirect unauthenticated to /admin/login
- Use HttpOnly cookie for session token
- Validate all API inputs with Zod

INTEGRATION WITH PUBLIC SITE
- The public site should read data from DB via a lightweight data access layer in /lib/data/*.
- Provide a seed script with demo data in VI and partial EN to show fallback.
- Ensure existing frontend continues to work; if currently using mock data, replace with DB reads but keep types compatible.

OUTPUT (CODE ONLY)
- Provide full file tree + complete code for new/changed files.
- Include migration and seed instructions in a README_admin.md.
- No explanations outside code; include comments in code where necessary.
