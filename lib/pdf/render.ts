import puppeteer from "puppeteer";
import type { Browser } from "puppeteer";

let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browserPromise;
}

/**
 * Renders a self-contained HTML string into a real, text-based vector PDF
 * (selectable text, not a screenshot) via headless Chrome.
 */
export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width:100%;font-size:8px;color:#8a94a6;font-family:'Segoe UI',Roboto,Arial,sans-serif;
                    text-align:center;padding:0 14mm;">
          Gurshaland · <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>`,
      margin: { top: "12mm", right: "14mm", bottom: "14mm", left: "14mm" },
    });
    return Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
  } catch (error) {
    // The browser may be in a bad state; drop the singleton so the next
    // request launches a fresh one.
    browserPromise = null;
    await browser.close().catch(() => {});
    throw error;
  } finally {
    await page.close().catch(() => {});
  }
}
