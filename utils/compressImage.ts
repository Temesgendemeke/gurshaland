export interface CompressedImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
}

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg" | "image/png";
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });
}

/**
 * Converts and compresses an image File to WebP format (or specified MIME type),
 * constraining dimensions to max bounds while preserving aspect ratio.
 * Falls back to the original file if the environment doesn't support canvas or for animated GIFs/SVGs.
 */
export async function compressImageToFile(
  file: File,
  options: ImageCompressionOptions = {},
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    mimeType = "image/webp",
  } = options;

  // Don't attempt to rasterize SVG or compress animated GIFs
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // Ensure running in browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  try {
    let imgWidth = 0;
    let imgHeight = 0;
    let drawable: CanvasImageSource;

    // Use createImageBitmap if available for high-performance off-main-thread decoding
    if ("createImageBitmap" in window) {
      const bitmap = await createImageBitmap(file);
      imgWidth = bitmap.width;
      imgHeight = bitmap.height;
      drawable = bitmap;
    } else {
      const rawDataUrl = await readAsDataUrl(file);
      const img = await loadImage(rawDataUrl);
      imgWidth = img.naturalWidth;
      imgHeight = img.naturalHeight;
      drawable = img;
    }

    if (imgWidth <= 0 || imgHeight <= 0) {
      return file;
    }

    // Calculate scaled dimensions keeping aspect ratio
    let width = imgWidth;
    let height = imgHeight;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, width);
    canvas.height = Math.max(1, height);

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(drawable, 0, 0, canvas.width, canvas.height);

    // Clean up bitmap memory if used
    if ("close" in drawable && typeof (drawable as ImageBitmap).close === "function") {
      (drawable as ImageBitmap).close();
    }

    // Convert to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), mimeType, quality);
    });

    if (!blob) return file;

    // Check if the compressed file is actually smaller than original;
    // for already heavily compressed tiny images, keep the smaller one.
    if (blob.size >= file.size && file.type === mimeType) {
      return file;
    }

    // Compute new file name with appropriate extension
    const extension =
      mimeType === "image/webp"
        ? ".webp"
        : mimeType === "image/png"
          ? ".png"
          : ".jpg";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const newFileName = `${baseName}${extension}`;

    return new File([blob], newFileName, {
      type: mimeType,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn(
      "Client-side image compression failed, falling back to original file:",
      error,
    );
    return file;
  }
}

export async function compressImageToDataUrl(
  file: File,
  maxDim = 1024,
  quality = 0.8,
): Promise<CompressedImage> {
  const rawDataUrl = await readAsDataUrl(file);
  const img = await loadImage(rawDataUrl);

  const scale = Math.min(
    1,
    maxDim / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return {
    dataUrl,
    base64: dataUrl.split(",")[1] ?? "",
    mimeType: "image/jpeg",
  };
}
