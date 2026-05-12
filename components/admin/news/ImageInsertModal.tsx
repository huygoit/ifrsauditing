"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedResizedBlob, type CropArea } from "@/lib/image/cropResize";
import type { Lang } from "@prisma/client";
import { tAdmin } from "@/lib/admin/i18n";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

async function uploadProcessedImage(blob: Blob) {
  const fd = new FormData();
  fd.append("file", new File([blob], "news.webp", { type: blob.type || "image/webp" }));
  const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd, credentials: "same-origin" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "upload_failed");
  const url = (json?.url as string | undefined) ?? "";
  if (!url) throw new Error("upload_failed");
  return url;
}

export function ImageInsertModal({
  open,
  onClose,
  onInserted,
  lang
}: {
  open: boolean;
  onClose: () => void;
  onInserted: (args: { url: string }) => void;
  lang: Lang;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(4 / 3);
  const [cropScale, setCropScale] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cropBoxRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => {
    if (!imageUrl) return;
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const onCropComplete = useCallback((_: any, cropped: CropArea) => {
    setCroppedAreaPixels(cropped);
  }, []);

  useEffect(() => {
    if (!cropBoxRef.current) return;
    const el = cropBoxRef.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setContainerSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setContainerSize({ w: r.width, h: r.height });
    return () => ro.disconnect();
  }, []);

  const cropSize = useMemo(() => {
    const w = containerSize.w;
    const h = containerSize.h;
    if (!w || !h || !Number.isFinite(aspect) || aspect <= 0) return undefined;
    // Fit crop area inside container, then scale down (Word-like "resize crop box")
    let baseW = w;
    let baseH = w / aspect;
    if (baseH > h) {
      baseH = h;
      baseW = h * aspect;
    }
    const s = Math.min(1, Math.max(0.55, cropScale));
    return { width: Math.round(baseW * s), height: Math.round(baseH * s) };
  }, [aspect, containerSize.h, containerSize.w, cropScale]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label={tAdmin(lang, "admin.posts.editor.modal.title")}>
      <button className="absolute inset-0 bg-slate-900/55" onClick={onClose} aria-label={tAdmin(lang, "common.close")} />
      <div
        className="absolute left-1/2 top-1/2 w-[94%] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{tAdmin(lang, "admin.posts.editor.modal.title")}</p>
            <p className="mt-1 text-xs text-slate-600">{tAdmin(lang, "admin.posts.editor.modal.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label={tAdmin(lang, "common.close")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid gap-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                e.target.value = "";
                setError(null);
                setFile(f);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCropScale(1);
                  setCroppedAreaPixels(null);
              }}
            />
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">{tAdmin(lang, "admin.posts.editor.modal.ratio")}</label>
                <select
                  value={String(aspect)}
                  onChange={(e) => setAspect(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm"
                >
                  <option value={String(4 / 3)}>4:3</option>
                  <option value={String(1)}>1:1</option>
                  <option value={String(16 / 9)}>16:9</option>
                  <option value={String(3 / 4)}>3:4</option>
                </select>
              </div>
            <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">{tAdmin(lang, "admin.posts.editor.modal.zoom")}</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">{tAdmin(lang, "admin.posts.editor.modal.crop_area")}</label>
                <input
                  type="range"
                  min={0.55}
                  max={1}
                  step={0.01}
                  value={cropScale}
                  onChange={(e) => setCropScale(Number(e.target.value))}
                />
              </div>
          </div>

          <div ref={cropBoxRef} className="relative h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {imageUrl ? (
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropSize={cropSize}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onMediaLoaded={(ms) => {
                  // default to "giữ tỉ lệ ảnh" if user hasn't changed ratio yet
                  if (!Number.isFinite(aspect) || aspect === 4 / 3) {
                    const a = ms.naturalWidth && ms.naturalHeight ? ms.naturalWidth / ms.naturalHeight : 4 / 3;
                    if (Number.isFinite(a) && a > 0) setAspect(a);
                  }
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-600">
                {tAdmin(lang, "admin.posts.editor.modal.select_to_start")}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600">
            {tAdmin(lang, "admin.posts.editor.modal.tip")}
          </p>

          {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              {tAdmin(lang, "admin.posts.editor.modal.cancel")}
            </button>
            <button
              type="button"
              disabled={!file || !croppedAreaPixels || uploading}
              onClick={async () => {
                if (!file || !croppedAreaPixels) return;
                setUploading(true);
                setError(null);
                try {
                  const { blob } = await getCroppedResizedBlob(file, croppedAreaPixels, {
                    maxWidth: 1600,
                    mimePreferred: "image/webp",
                    quality: 0.8
                  });
                  const url = await uploadProcessedImage(blob);
                  onInserted({ url });
                  onClose();
                } catch (e: any) {
                  setError(
                    e?.message === "unsupported_type"
                      ? tAdmin(lang, "admin.posts.editor.modal.unsupported_type")
                      : tAdmin(lang, "admin.posts.editor.modal.upload_error")
                  );
                } finally {
                  setUploading(false);
                }
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white shadow-sm transition",
                uploading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700",
                !file || !croppedAreaPixels ? "opacity-60" : ""
              )}
            >
              {uploading ? tAdmin(lang, "admin.posts.editor.modal.uploading") : tAdmin(lang, "admin.posts.editor.modal.crop_upload")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

