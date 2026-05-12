You are a senior frontend engineer and SEO-focused UI/UX designer.
Build a professional News system WITH CATEGORIES (listing + category + detail) for a product website using Next.js App Router and next-intl.

PROJECT CONTEXT
- Framework: Next.js 14 App Router + TypeScript
- Styling: TailwindCSS only
- Content source: MySQL via Prisma
- Posts authored in Admin using TipTap
- Stored as TipTap JSON in DB (post_translations.contentJson)
- Multi-language: next-intl
- Routes must be SEO-friendly and category-based
- style trang tin tức được kế thừa hoàn toàn trang chủ ensodata

LOCALES
- vi (default)
- en
- Fallback content: en → vi if missing

========================
DATA MODEL (UPDATED)
========================

PostCategory
- id
- sortOrder
- status (VISIBLE | HIDDEN)
- PostCategoryTranslation:
  - lang
  - name
  - slug
  - description
  - seoTitle
  - seoDescription

Post
- id
- categoryId
- coverImage
- author
- publishedAt
- status (PUBLISHED)
- tags[]
- PostTranslation:
  - lang
  - title
  - excerpt
  - slug
  - contentJson
  - seoTitle
  - seoDescription

Indexes:
- unique (category_translation.slug, lang)
- unique (post_translation.slug, lang)
- index post.categoryId
- index post.publishedAt

========================
ROUTES (SEO STRUCTURE)
========================

- /[locale]/news                      → All news
- /[locale]/news/[categorySlug]       → Category page
- /[locale]/news/[categorySlug]/[slug] → Post detail

Slugs are language-specific.

========================
PAGE 1: NEWS HOME
/[locale]/news
========================

- H1 localized: “Tin tức” / “News”
- Subtitle localized
- Category navigation bar:
  - Horizontal scroll on mobile
  - Active category highlighted
- Grid of posts (all categories)
- SEO:
  - title/description via next-intl
  - hreflang for vi/en

========================
PAGE 2: CATEGORY PAGE
/[locale]/news/[categorySlug]
========================

LAYOUT
- Category header:
  - H1: category name
  - Description (optional)
- Grid of posts belonging to category
- Empty state if no posts
- Breadcrumb:
  - Home → News → Category

SEO (IMPORTANT)
- Metadata from category translation:
  - title = seoTitle || category name
  - description = seoDescription || description
- Canonical URL
- JSON-LD: CollectionPage

========================
PAGE 3: POST DETAIL
/[locale]/news/[categorySlug]/[slug]
========================

LAYOUT (EDITORIAL)
- Breadcrumb:
  - Home → News → Category → Post
- Title (H1)
- Meta: date · author · category
- Hero image
- Content:
  - Render TipTap JSON → HTML
  - Reading-optimized typography
- Below content:
  - Divider
  - Related posts (same category, same locale)

SIDEBAR (DESKTOP)
- Sticky:
  - Categories list
  - Recent posts

SEO (VERY IMPORTANT)
- Metadata per locale:
  - title = seoTitle || title
  - description = seoDescription || excerpt
- Article JSON-LD:
  - headline
  - image
  - datePublished
  - author
  - articleSection (category name)
- hreflang vi/en
- Proper h1/h2 hierarchy

========================
MULTI-LANGUAGE LOGIC
========================

- Use next-intl for:
  - Static UI labels
  - Page titles
- Content:
  - Query translations by locale
  - Fallback to vi if missing
- Category slug and post slug are per-language

========================
IMPLEMENTATION DETAILS
========================

- Use Server Components for data fetching
- generateMetadata() per page
- Central helpers:
  - getCategories(locale)
  - getPosts(locale, categorySlug?)
  - getPostBySlug(locale, categorySlug, slug)
- Render TipTap JSON safely (sanitize)
- Use custom prose styles (no typography plugin)

========================
FILES TO CREATE / UPDATE
========================

- app/[locale]/news/page.tsx
- app/[locale]/news/[categorySlug]/page.tsx
- app/[locale]/news/[categorySlug]/[slug]/page.tsx

- components/news/CategoryNav.tsx
- components/news/NewsCard.tsx
- components/news/RelatedPosts.tsx

- lib/news/getCategories.ts
- lib/news/getPosts.ts
- lib/news/getPostBySlug.ts
- lib/editor/renderTiptapJson.ts

- messages/vi.json
- messages/en.json

========================
DESIGN TONE
========================
- Editorial, eco-premium
- Calm, trustworthy
- Knowledge hub style (not personal blog)
- White space, strong hierarchy

OUTPUT
- Full code
- Must compile and run
- No explanations, code only
