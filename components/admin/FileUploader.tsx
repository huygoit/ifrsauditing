"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { Lang } from "@prisma/client";
import { tAdmin } from "@/lib/admin/i18n";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

type UploadErrorCode =
  | "unauthorized"
  | "no_file"
  | "unsupported_type"
  | "file_too_large"
  | "upload_failed"
  | "bad_response";

function messageForUploadError(lang: Lang, code: UploadErrorCode, extra?: { mime?: string; status?: number }) {
  // Keep copy short; admin users need actionable info.
  if (code === "unauthorized") return lang === "en" ? "Session expired. Please re-login." : "Phiên đăng nhập hết hạn. Đăng nhập lại nhé.";
  if (code === "no_file") return lang === "en" ? "No file selected." : "Chưa chọn file.";
  if (code === "file_too_large") return lang === "en" ? "File is too large (max 20MB)." : "File quá nặng (tối đa 20MB).";
  if (code === "unsupported_type")
    return lang === "en"
      ? `Unsupported file type${extra?.mime ? `: ${extra.mime}` : ""}.`
      : `Định dạng file không hỗ trợ${extra?.mime ? `: ${extra.mime}` : ""}.`;
  if (code === "bad_response")
    return lang === "en"
      ? `Upload failed (HTTP ${extra?.status ?? "?"}).`
      : `Upload lỗi (HTTP ${extra?.status ?? "?"}).`;
  return lang === "en" ? "Upload failed. Please try again." : "Upload lỗi. Kiểm tra file và thử lại.";
}

async function uploadFiles(opts: { files: File[]; folder: string }) {
  const fd = new FormData();
  fd.set("folder", opts.folder);
  for (const f of opts.files) fd.append("file", f);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "same-origin" });
  const ct = res.headers.get("content-type") || "";
  const json = ct.includes("application/json") ? await res.json().catch(() => ({})) : null;
  if (!res.ok) {
    const err = new Error((json as any)?.error || "upload_failed") as Error & {
      status?: number;
      mime?: string;
    };
    err.status = res.status;
    err.mime = (json as any)?.mime;
    throw err;
  }
  return (json.files ?? []) as Array<{ src: string; name: string; size: number; type: string }>;
}

function PreviewThumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 p-1 text-center">
          <span className="text-[10px] font-medium text-amber-700">Lỗi tải ảnh</span>
          <a href={src} target="_blank" rel="noreferrer" className="truncate text-[9px] text-slate-500 underline">
            {src}
          </a>
        </div>
      ) : (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function FileUploader({
  folder,
  accept = "image/*",
  multiple = false,
  value,
  onChange,
  values,
  onChangeMany
}: {
  folder: string;
  accept?: string;
  multiple?: boolean;
  // single mode
  value?: string;
  onChange?: (src: string) => void;
  // multi mode
  values?: string[];
  onChangeMany?: (srcs: string[]) => void;
}) {
  const lang: Lang =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "vi";
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    if (multiple) return (values ?? []).filter(Boolean);
    return value ? [value] : [];
  }, [multiple, value, values]);

  async function handle(files: File[]) {
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadFiles({ files, folder });
      const srcs = uploaded.map((u) => u.src);
      if (multiple) {
        const next = [...(values ?? []), ...srcs];
        onChangeMany?.(next);
      } else {
        if (srcs[0]) onChange?.(srcs[0]);
      }
    } catch (e: any) {
      const code = (e?.message as UploadErrorCode) || "upload_failed";
      setError(messageForUploadError(lang, code, { mime: e?.mime, status: e?.status }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div
        className={cn(
          "rounded-2xl border border-dashed bg-slate-50 px-4 py-3 text-sm transition",
          dragOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const list = Array.from(e.dataTransfer.files ?? []);
          void handle(list);
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upload</p>
            <p className="mt-1 text-sm text-slate-700">
              Kéo thả file vào đây, hoặc{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                chọn file
              </button>
              .
            </p>
          </div>
          <div className="flex items-center gap-2">
            {preview.length ? (
              <button
                type="button"
                onClick={() => {
                  if (multiple) onChangeMany?.([]);
                  else onChange?.("");
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {tAdmin(lang, "common.clear")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {uploading ? tAdmin(lang, "common.loading") : tAdmin(lang, "common.upload")}
            </button>
          </div>
        </div>

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            e.target.value = "";
            void handle(list);
          }}
        />
      </div>

      {preview.length ? (
        <div className="flex flex-wrap gap-2">
          {preview.slice(0, 6).map((src) => (
            <PreviewThumb key={src} src={src} />
          ))}
          {preview.length > 6 ? <span className="text-xs text-slate-500">+{preview.length - 6}</span> : null}
        </div>
      ) : null}

      {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
}


