You are upgrading an existing Next.js App Router + Tailwind eco-green multi-product landing for ENSO (hạt khử mùi). Add a premium “Trust & Proof” system with two new sections: (1) Certifications/Partners trust strip + detailed certifications grid, and (2) Video proof gallery with a clean modal player. This must be an enhancement on top of the existing site, not a full rewrite.

CONSTRAINTS
- Keep current structure and styles (emerald eco palette, max-w-6xl, rounded-2xl cards).
- Static export compatible: no server actions, no API routes.
- No external UI libs (no shadcn, no MUI, no Framer/GSAP).
- Use Tailwind + small React state only.
- Use <img> for logos/thumbnails (static friendly).
- Respect prefers-reduced-motion.
- Performance: do not load heavy embeds until user clicks.

WHAT TO ADD (NEW SECTIONS)
A) TRUST STRIP (place directly under Hero)
- Component: components/TrustStrip.tsx
- Layout: horizontal row of 6–10 logo pills (certifications + partners).
- Style: monochrome/gray logos by default (opacity-70, grayscale), on hover remove grayscale + raise slight shadow.
- Each logo has tooltip on hover/focus: short text (1–2 lines).
- Mobile: horizontally scrollable (snap) with hidden scrollbar.

B) CERTIFICATIONS & PARTNERS DETAILS (place after Benefits or after UseCases)
- Component: components/Certifications.tsx
- Grid 2–3 columns (responsive):
  - Card includes: logo, title, short consumer-friendly description (not too technical), optional “Xem chứng nhận” button.
- If “Xem chứng nhận” clicked:
  - open ImageModal with full certificate image (zoomable, but simple).
  - Component: components/ImageModal.tsx (reusable)
- Add small “Why it matters” subheading explaining trust in plain Vietnamese.

C) VIDEO PROOF (place before Testimonials or before Order section)
- Component: components/VideoProof.tsx
- 3–6 videos in a grid:
  - Thumbnail card with play button overlay, title, length badge (e.g., 0:45)
- On click: open VideoModal (components/VideoModal.tsx)
  - Must support:
    1) YouTube link (embed only when opened)
    2) MP4 file in /public/videos (use <video controls>)
  - Close on backdrop click + Esc
  - Stop playback on close (unmount iframe/video).

DATA MODEL
Create a file: lib/trust.ts with mock data and easy to replace:
- trustLogos: { id, name, logoSrc, note }[]
- certifications: { id, title, logoSrc, description, certificateImageSrc? }[]
- videos: { id, title, type: 'youtube'|'mp4', src, thumbnailSrc, duration }[]

ASSETS
Assume assets will be placed in:
- public/trust/*.png (logos)
- public/certs/*.jpg (certificate images)
- public/video-thumbs/*.jpg (thumbnails)
- public/videos/*.mp4 (optional)

UI/UX QUALITY (VIP)
- Section headers:
  - small eyebrow text (uppercase tracking) + H2 + short intro
- Micro-interactions:
  - card hover lift, play button pulse on hover
- Accessibility:
  - buttons have aria-label
  - modals trap focus lightly (focus first close button), restore focus on close
  - tooltips appear on focus as well as hover

INTEGRATION
- Update app/page.tsx to insert:
  - <TrustStrip />
  - <Certifications />
  - <VideoProof />
- Ensure anchors in header can scroll to these sections:
  - #chung-nhan
  - #video

OUTPUT
- Provide file tree + full code for all new/modified files only.
- Code only, no explanations.
- Ensure TypeScript types included.
- Ensure Tailwind classes match existing design system.
