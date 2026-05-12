export type CropArea = { x: number; y: number; width: number; height: number };

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}

export async function loadImageFromFile(file: File) {
  const url = URL.createObjectURL(file);
  try {
    return await loadImageFromUrl(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) reject(new Error("toBlob_failed"));
        else resolve(b);
      },
      mime,
      quality
    );
  });
}

export async function getCroppedResizedBlob(
  file: File,
  croppedAreaPixels: CropArea,
  opts: { maxWidth: number; mimePreferred: "image/webp" | "image/jpeg"; quality: number }
) {
  // 1) Load image
  const img = await loadImageFromFile(file);

  // 2) Crop to a canvas
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = Math.max(1, Math.round(croppedAreaPixels.width));
  cropCanvas.height = Math.max(1, Math.round(croppedAreaPixels.height));
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("canvas_ctx_missing");

  cropCtx.drawImage(
    img,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height
  );

  // 3) Resize if needed
  let outCanvas = cropCanvas;
  if (outCanvas.width > opts.maxWidth) {
    const scale = opts.maxWidth / outCanvas.width;
    const w = Math.max(1, Math.round(outCanvas.width * scale));
    const h = Math.max(1, Math.round(outCanvas.height * scale));
    const resized = document.createElement("canvas");
    resized.width = w;
    resized.height = h;
    const rctx = resized.getContext("2d");
    if (!rctx) throw new Error("canvas_ctx_missing");
    rctx.drawImage(outCanvas, 0, 0, outCanvas.width, outCanvas.height, 0, 0, w, h);
    outCanvas = resized;
  }

  // 4) Export blob (prefer WebP)
  const mime = opts.mimePreferred;
  const blob = await canvasToBlob(outCanvas, mime, opts.quality).catch(async () => {
    // Fallback for browsers that don't support webp
    return await canvasToBlob(outCanvas, "image/jpeg", opts.quality);
  });

  return { blob, width: outCanvas.width, height: outCanvas.height };
}

