import { render } from "takumi-pdf";
import type { ReactNode } from "react";
import React from "react";

export interface RenderPdfOptions {
  size?: "a4" | "letter";
  title?: string;
}

const defaultFooter = (
  <div
    style={{
      width: "100%",
      fontSize: 8,
      color: "#a1a1aa",
      fontFamily: "Helvetica, Arial, sans-serif",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 28px",
      boxSizing: "border-box",
    }}
  >
    <span>Gurshaland · Ethiopian Culinary Archive</span>
    <span>
      Page <span className="pageNumber" /> of <span className="totalPages" />
    </span>
  </div>
);

/**
 * Renders a pdfcn React component into a high-quality vector PDF Buffer.
 * Uses Takumi PDF (from pdfcn) directly in Node.js without headless Chrome.
 */
export async function renderPdfDocument(
  node: ReactNode,
  options?: RenderPdfOptions,
): Promise<Buffer> {
  const bytes = await render(node as any, {
    size: options?.size ?? "a4",
    margin: { top: 28, bottom: 28, left: 28, right: 28 },
    footer: defaultFooter,
  });

  return Buffer.from(bytes);
}

/**
 * Renders a self-contained HTML string into a real vector PDF via takumi-pdf
 * (backward-compatible with any existing callers).
 */
export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const bytes = await render(html, {
    size: "a4",
    margin: { top: 28, bottom: 28, left: 28, right: 28 },
    footer: defaultFooter,
  });

  return Buffer.from(bytes);
}
