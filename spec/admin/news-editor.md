Implement TipTap editor in our Next.js App Router admin using TipTap’s “Simple Editor” template/UI (so it looks very close to tiptap.dev/product/editor). Priority: fastest to match the screenshot UI. Data must be stored as TipTap JSON in DB.

CONTEXT
- Same Next.js project (public site + /admin).
- Admin posts editor lives in /admin/posts quick-edit drawer.
- Database: MySQL + Prisma, i18n approach 1 with PostTranslation table.
- We want to store content as TipTap JSON: post_translations.contentJson (Json type in Prisma).
- Also generate derived HTML for preview/render (optional) but JSON is source of truth.

GOAL
- Integrate TipTap “Simple Editor” template UI (toolbar, add menu, selection bubble menu, dark editor surface).
- Provide image insert (upload) like the template’s “Add”.
- Make it production-ready and easy to use.

APPROACH (HƯỚNG 2)
- Use TipTap official template/UI approach (Simple Editor). Copy/adapt the template structure into our codebase.
- DO NOT pull a heavy UI library; keep components local and styled with Tailwind.
- It’s okay to adapt the template’s CSS to Tailwind utilities (preferred). If needed, include a small CSS module for editor content styles.
- Ensure all TipTap extensions used are MIT/open-source.

EXTENSIONS (FREE ONLY)
- StarterKit
- Underline
- Link (openOnClick: false)
- Image
- Placeholder
- TextAlign (paragraph + headings)
- Dropcursor, Gapcursor
- (Optional) CharacterCount

DATA (JSON)
- Editor value prop: initialContentJson (TipTap JSON) or null
- On change (debounced 500ms): call onChangeJson(editor.getJSON())
- Provide “Preview” tab that renders HTML generated from the editor state (editor.getHTML()).
- Save JSON to DB; HTML only for preview or caching (optional).

IMAGE UPLOAD (REQUIRED)
- Create API: POST /api/admin/upload
  - multipart/form-data file
  - store to /public/uploads/YYYY/MM/
  - return { url }
- In editor “Add” menu:
  - Image -> choose file -> upload -> insert image node with returned url
- Also support drag-drop and paste image -> upload -> insert.
- Show upload progress indicator (toast or small spinner).

FILES TO CREATE/EDIT
- components/editor/SimpleTiptapEditor.tsx (client component)
- components/editor/simple/* (toolbar, add menu, bubble menu, helpers)
- lib/editor/uploadImage.ts (calls /api/admin/upload)
- app/api/admin/upload/route.ts
- Add minimal CSS for editor content:
  - headings, lists, blockquote, code, hr, links, images
  - match the screenshot vibe (dark surface, readable text)

INTEGRATION
- In /admin/posts edit drawer form:
  - Replace textarea with <SimpleTiptapEditor />
  - Save JSON to post_translation.contentJson
  - Use selected admin lang (?lang=vi|en) to load/save the correct translation row.

UX REQUIREMENTS
- Minimal clicks:
  - toolbar always visible
  - Add menu for blocks
  - bubble menu for selection
- Keyboard shortcuts work (Cmd/Ctrl+B/I/U, undo/redo).
- Accessible: aria-label on buttons, focus-visible rings, ESC closes menus.
- Respect prefers-reduced-motion.

OUTPUT
- Provide full code for new/modified files.
- Ensure it compiles in Next.js App Router.
- Keep UI as close as possible to tiptap.dev/product/editor.
- Code only, no explanations.
# PROMPT cho Cursor AI — TipTap (FREE) + Upload ảnh + Crop tự do + Resize/Nén + Insert đúng vị trí con trỏ

Bạn là senior full-stack dev. Hãy triển khai trang Admin Tin tức dùng TipTap (open-source) và tính năng chèn ảnh: chọn file -> crop tự do -> resize/nén -> upload -> insert vào TipTap đúng vị trí con trỏ.

## 1) Mục tiêu
- Admin tạo/sửa bài viết có TipTap editor.
- Toolbar có nút “Chèn ảnh”.
- Khi bấm “Chèn ảnh”:
  1) Chọn file ảnh (png/jpg/webp)
  2) Hiện modal crop ảnh (crop tự do, có zoom)
  3) Sau crop: xuất ảnh mới bằng canvas
  4) Resize ảnh về maxWidth = 1600px (giữ tỉ lệ), nén quality ~ 0.8, ưu tiên WebP
  5) Upload ảnh đã xử lý lên API `/api/admin/upload-image`
  6) API trả `{ url, width, height }`
  7) Insert ảnh vào TipTap đúng vị trí con trỏ hiện tại (restore selection trước khi setImage)
  8) Có loading + toast lỗi + retry
- Không dùng package trả phí.

## 2) Package free cần cài
- @tiptap/react @tiptap/starter-kit
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-underline
- @tiptap/extension-text-align
- @tiptap/extension-placeholder
- react-easy-crop
- (optional) sonner hoặc react-hot-toast để toast

## 3) Component/Files cần tạo
### A) `components/admin/news/NewsEditor.tsx`
- TipTap editor + toolbar.
- Trước khi mở modal chèn ảnh, lưu selection hiện tại:
  - `const savedSelection = editor.state.selection;` (lưu from/to)
- Khi modal upload xong:
  - `editor.chain().focus().setTextSelection({ from, to }).setImage({ src: url, alt }).run()`
- `alt` mặc định = title bài viết hoặc "image".

### B) `components/admin/news/NewsToolbar.tsx`
- Nút “Chèn ảnh” mở `ImageInsertModal`.
- Các nút cơ bản: bold/italic/underline, list, link, undo/redo, align.

### C) `components/admin/news/ImageInsertModal.tsx`
- Modal/dialog gồm:
  - input type file
  - vùng crop dùng react-easy-crop (free aspect)
  - zoom slider
  - nút Cancel / “Cắt & Tải lên”
- State:
  - selectedFile, crop, zoom, croppedAreaPixels, isUploading
- Khi “Cắt & Tải lên”:
  - gọi `getCroppedResizedBlob(...)`
  - upload blob qua multipart/form-data field name `file`
  - nhận url -> callback về editor để insert

### D) `lib/image/cropResize.ts`
Implement:
- `loadImageFromFile(file): Promise<HTMLImageElement>`
- `getCroppedResizedBlob(file, croppedAreaPixels, options): Promise<{ blob: Blob; width: number; height: number }>`
Options:
- maxWidth: 1600
- mimePreferred: 'image/webp' fallback 'image/jpeg'
- quality: 0.8
Yêu cầu:
- Dùng canvas để crop theo croppedAreaPixels
- Resize nếu width > maxWidth
- Xuất blob (toBlob)

### E) API Upload: `app/api/admin/upload-image/route.ts`
- Nhận multipart/form-data (field `file`)
- Validate:
  - mime: image/*
  - size limit (ví dụ 5MB)
- Lưu file:
  - DEV: lưu `public/uploads/news/`
  - File name: `${Date.now()}-${random}.webp` (theo mime)
- Trả JSON: `{ url: "/uploads/news/xxx.webp" }` (width/height optional)
- Đảm bảo folder tồn tại, handle lỗi rõ.

## 4) Yêu cầu UX
- Upload loading: disable nút, show spinner.
- Lỗi upload: toast + giữ modal để thử lại.
- Thành công: đóng modal, insert ảnh ngay vị trí con trỏ.
- Không được làm mất nội dung đang soạn.

## 5) Output mong muốn
- Code đầy đủ cho:
  - NewsEditor.tsx
  - NewsToolbar.tsx
  - ImageInsertModal.tsx
  - lib/image/cropResize.ts
  - route.ts upload-image
- TypeScript rõ ràng, comment ở đoạn crop/resize + restore selection.
- Không dùng markdown/migrate.

BẮT ĐẦU IMPLEMENT NGAY.
