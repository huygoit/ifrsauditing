Add a new Admin module: FAQ management to the existing ENSO Admin (Next.js App Router, Tailwind, Prisma/MySQL, i18n approach 1 with translation tables). Must follow the same UX patterns: DataTable + QuickEditDrawer, minimal clicks.

GOAL
- Manage FAQs shown on the public site.
- Each FAQ has 2 translatable fields:
  - question
  - answer
- Support status, sort order, and optional grouping by “section” (optional) without increasing complexity.

DATABASE (PRISMA + MYSQL)
Add these models to prisma/schema.prisma:

1) Faq
- id (autoincrement)
- status: VISIBLE | HIDDEN
- sortOrder: int default 0
- sectionKey: string? (optional, e.g. "shipping", "usage", "returns")
- createdAt, updatedAt

2) FaqTranslation
- id
- faqId (FK)
- lang: 'vi' | 'en'
- question: string
- answer: string (long text)
- UNIQUE(faqId, lang)
- Index(lang), Index(faqId)

Include migration.

ADMIN ROUTES / NAV
- Add sidebar item: “FAQ”
- Route: /admin/faq

ADMIN UI REQUIREMENTS (VIP PRO / MIN CLICKS)
FAQ list page includes:
- Search box (search question text for current lang + fallback)
- Filters:
  - status (visible/hidden)
  - sectionKey (optional)
- DataTable columns:
  - sortOrder (editable or quick controls)
  - question (current lang)
  - status toggle (inline)
  - updatedAt
  - row actions: Edit, Duplicate, Delete

Reordering:
- Provide quick up/down buttons or drag handle (choose simplest reliable).
- Persist sortOrder updates.

Quick Edit Drawer (create/edit)
- Language tabs or language controlled by ?lang= (consistent with existing admin).
- Show fields:
  - Question (input)
  - Answer (rich text NOT required; use textarea with nice formatting + basic markdown allowed)
  - Section (optional select with common options + “custom”)
  - Status toggle
  - Sort order
- If editing EN and translation missing:
  - show “Fallback: VI”
  - button “Copy VI → EN” to prefill question/answer

Bulk actions:
- Bulk set VISIBLE / HIDDEN
- Bulk delete (confirm)

VALIDATION (ZOD)
- question required, 3–180 chars
- answer required, 10–5000 chars
- sectionKey optional, <= 40 chars

API ROUTES (Route Handlers)
/app/api/admin/faq/route.ts
- GET: list FAQs with pagination, filters, lang + fallback
- POST: create FAQ + translation for current lang

/app/api/admin/faq/[id]/route.ts
- GET: fetch one FAQ with both translations
- PATCH: update FAQ base fields and translation for selected lang
- DELETE: delete FAQ and its translations

Also add:
/app/api/admin/faq/bulk/route.ts
- POST: bulk actions (set status, delete)

DATA ACCESS LAYER
- lib/admin/faq.ts (fetch wrappers for client)
- Use existing auth/session protection.

PUBLIC SITE INTEGRATION (small)
- Add a helper lib/public/getFaqs(locale) that returns visible FAQs with fallback vi.
- Do NOT redesign the public UI, just provide the data function.

FILES TO CREATE/EDIT
- app/admin/faq/page.tsx
- components/admin/faq/FaqTable.tsx
- components/admin/faq/FaqDrawer.tsx
- components/admin/faq/FaqForm.tsx
- app/api/admin/faq/* route handlers
- prisma/schema.prisma (add models)
- Add sidebar nav link

OUTPUT
- Provide full code for all created/modified files.
- Ensure it compiles with Next.js App Router.
- Keep styling consistent with the existing ENSO admin design system (rounded-2xl, calm slate background, emerald accents).
- No explanations, code only.
