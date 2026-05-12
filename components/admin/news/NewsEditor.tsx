"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, Tiptap, TiptapBubbleMenu, useEditor, type JSONContent } from "@tiptap/react";
import type { Lang } from "@prisma/client";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Link as LinkIcon, Underline as UnderlineIcon } from "lucide-react";
import { NewsToolbar } from "@/components/admin/news/NewsToolbar";
import { ImageInsertModal } from "@/components/admin/news/ImageInsertModal";
import { tAdmin } from "@/lib/admin/i18n";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function NewsEditor({
  initialContentJson,
  initialContentHtml,
  onChangeJson,
  onChangeHtml,
  onProvideSnapshot,
  titleForAlt,
  lang
}: {
  initialContentJson: JSONContent | null;
  initialContentHtml?: string | null;
  onChangeJson: (json: JSONContent) => void;
  onChangeHtml: (html: string) => void;
  onProvideSnapshot?: ((get: (() => { json: JSONContent; html: string }) | null) => void) | undefined;
  titleForAlt?: string;
  lang: Lang;
}) {
  const [mounted, setMounted] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const debounceRef = useRef<number | null>(null);

  const extensions = useMemo(
    () => [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true, HTMLAttributes: { rel: "noreferrer", target: "_blank" } }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: tAdmin(lang, "admin.posts.form.content") + "…" })
    ],
    [lang]
  );

  useEffect(() => setMounted(true), []);

  const editor = useEditor(
    {
      extensions,
      content: initialContentJson ?? initialContentHtml ?? { type: "doc", content: [{ type: "paragraph" }] },
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: cn(
            "ProseMirror min-h-[420px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-sm text-slate-100 shadow-sm outline-none",
            "selection:bg-emerald-400/30"
          )
        }
      }
    },
    [mounted]
  );

  useEffect(() => {
    if (!onProvideSnapshot) return;
    if (!editor) {
      onProvideSnapshot(null);
      return;
    }
    onProvideSnapshot(() => ({ json: editor.getJSON(), html: editor.getHTML() }));
    return () => onProvideSnapshot(null);
  }, [editor, onProvideSnapshot]);

  // debounce 500ms: save JSON (source of truth) + derived HTML
  useEffect(() => {
    if (!editor) return;
    const handler = () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        const json = editor.getJSON();
        onChangeJson(json);
        onChangeHtml(editor.getHTML());
      }, 500);
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    };
  }, [editor, onChangeHtml, onChangeJson]);

  function openImageModal() {
    if (!editor) return;
    const sel = editor.state.selection;
    savedSelectionRef.current = { from: sel.from, to: sel.to };
    setImageModalOpen(true);
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <NewsToolbar editor={editor} onInsertImage={openImageModal} lang={lang} />
          {uploading ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-slate-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {tAdmin(lang, "admin.posts.editor.uploading")}
            </span>
          ) : null}
        </div>
      </div>

      {/* bubble menu */}
      <Tiptap instance={editor}>
        <TiptapBubbleMenu className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-2 py-2 shadow-xl">
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800",
              editor?.isActive("bold") ? "ring-2 ring-emerald-400/70" : ""
            )}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            aria-label={tAdmin(lang, "admin.posts.editor.toolbar.bold")}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800",
              editor?.isActive("italic") ? "ring-2 ring-emerald-400/70" : ""
            )}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            aria-label={tAdmin(lang, "admin.posts.editor.toolbar.italic")}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800",
              editor?.isActive("underline") ? "ring-2 ring-emerald-400/70" : ""
            )}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            aria-label={tAdmin(lang, "admin.posts.editor.toolbar.underline")}
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800",
              editor?.isActive("link") ? "ring-2 ring-emerald-400/70" : ""
            )}
            onClick={() => {
              if (!editor) return;
              const prev = editor.getAttributes("link")?.href ?? "";
              const href = window.prompt(tAdmin(lang, "admin.posts.editor.toolbar.link_prompt"), prev);
              if (href === null) return;
              const cleaned = href.trim();
              if (!cleaned) editor.chain().focus().unsetLink().run();
              else editor.chain().focus().setLink({ href: cleaned }).run();
            }}
            aria-label={tAdmin(lang, "admin.posts.editor.toolbar.link")}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </TiptapBubbleMenu>
      </Tiptap>

      <EditorContent editor={editor} />

      <ImageInsertModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        lang={lang}
        onInserted={({ url }) => {
          if (!editor) return;
          const sel = savedSelectionRef.current;
          const alt = (titleForAlt?.trim() || tAdmin(lang, "admin.posts.editor.image_alt_fallback")).slice(0, 120);
          setUploading(true);
          try {
            const chain = editor.chain().focus();
            if (sel) chain.setTextSelection({ from: sel.from, to: sel.to });
            chain.setImage({ src: url, alt }).run();
          } finally {
            setUploading(false);
          }
        }}
      />
    </div>
  );
}

