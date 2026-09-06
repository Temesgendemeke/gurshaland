/**
 * Fetches a remote image URL and encodes it as a base64 data URI.
 * This is necessary for Takumi PDF / vector PDF generation in Node.js,
 * which cannot asynchronously resolve remote HTTP URLs during sync document rasterization.
 */
export async function resolveImageAsDataUri(
  url?: string,
  timeoutMs = 8000
): Promise<string | undefined> {
  if (!url) return undefined;
  if (url.startsWith("data:")) return url;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[PDF Image] Failed to fetch image ${url}: status ${res.status}`);
      return undefined;
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.warn(`[PDF Image] Error fetching image ${url}:`, err);
    return undefined;
  }
}
