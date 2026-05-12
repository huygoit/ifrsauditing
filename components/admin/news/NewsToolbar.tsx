"use client";

import type { Editor } from "@tiptap/react";
import type { Lang } from "@prisma/client";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Underline as UnderlineIcon,
  Undo2
} from "lucide-react";
import { tAdmin } from "@/lib/admin/i18n";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Btn({
  label,
  active,
  disabled,
  onClick,
  children
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition",
        "border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800 disabled:opacity-50",
        active ? "ring-2 ring-emerald-400/70" : ""
      )}
    >
      {children}
    </button>
  );
}

export function NewsToolbar({
  editor,
  onInsertImage,
  lang
}: {
  editor: Editor | null;
  onInsertImage: () => void;
  lang: Lang;
}) {
  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link")?.href ?? "";
    const href = window.prompt(tAdmin(lang, "admin.posts.editor.toolbar.link_prompt"), prev);
    if (href === null) return;
    const cleaned = href.trim();
    if (!cleaned) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: cleaned }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onInsertImage}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-100 shadow-sm hover:bg-slate-800"
      >
        <ImagePlus className="h-4 w-4" />
        {tAdmin(lang, "admin.posts.editor.toolbar.insert_image")}
      </button>

      <div className="mx-1 hidden h-9 w-px bg-slate-700 sm:block" />

      <Btn
        label={tAdmin(lang, "admin.posts.editor.toolbar.bold")}
        active={editor?.isActive("bold")}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn
        label={tAdmin(lang, "admin.posts.editor.toolbar.italic")}
        active={editor?.isActive("italic")}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn
        label={tAdmin(lang, "admin.posts.editor.toolbar.underline")}
        active={editor?.isActive("underline")}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Btn>
      <Btn label={tAdmin(lang, "admin.posts.editor.toolbar.link")} active={editor?.isActive("link")} disabled={!editor} onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </Btn>

      <Btn
        label={tAdmin(lang, "admin.posts.editor.toolbar.bullet_list")}
        active={editor?.isActive("bulletList")}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Btn>
      <Btn
        label={tAdmin(lang, "admin.posts.editor.toolbar.ordered_list")}
        active={editor?.isActive("orderedList")}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Btn>

      <div className="mx-1 hidden h-9 w-px bg-slate-700 sm:block" />

      <Btn label={tAdmin(lang, "admin.posts.editor.toolbar.align_left")} disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="h-4 w-4" />
      </Btn>
      <Btn label={tAdmin(lang, "admin.posts.editor.toolbar.align_center")} disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="h-4 w-4" />
      </Btn>
      <Btn label={tAdmin(lang, "admin.posts.editor.toolbar.align_right")} disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="h-4 w-4" />
      </Btn>

      <div className="mx-1 hidden h-9 w-px bg-slate-700 sm:block" />

      <Btn label={tAdmin(lang, "admin.posts.editor.toolbar.undo")} disabled={!editor} onClick={() => editor?.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn label={tAdmin(lang, "admin.posts.editor.toolbar.redo")} disabled={!editor} onClick={() => editor?.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </Btn>
    </div>
  );
}

