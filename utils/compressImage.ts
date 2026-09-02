export interface CompressedImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
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
