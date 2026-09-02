"use server";

import { refundCredits, spendCredits } from "@/actions/credits";
import {
  MEAL_PLAN_PDF_CREDIT_COST,
  RECIPE_PDF_CREDIT_COST,
} from "@/constants/creditCosts";
import { renderHtmlToPdf } from "@/lib/pdf/render";
import {
  buildMealPlanPdfHtml,
  buildRecipePdfHtml,
  type PdfMealInput,
  type PdfRecipeInput,
} from "@/lib/pdf/templates";

export type PdfGenerationResult =
  | { success: true; base64: string; filename: string; creditsUsed: number }
  | { success: false; error: string };

const toFilename = (value: unknown, fallback: string): string => {
  const base = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || fallback}.pdf`;
};

const renderWithCredit = async (
  cost: number,
  html: string,
  filename: string,
): Promise<PdfGenerationResult> => {
  const creditResult = await spendCredits(cost);
  if (!creditResult.success) {
    return {
      success: false,
      error: creditResult.error || "Not enough credits.",
    };
  }

  try {
    const buffer = await renderHtmlToPdf(html);
    return {
      success: true,
      base64: buffer.toString("base64"),
      filename,
      creditsUsed: cost,
    };
  } catch (error) {
    console.error("PDF generation failed:", error);
    // Don't charge the user for a failed PDF render.
    await refundCredits(cost).catch(() => {});
    return {
      success: false,
      error: "We couldn't generate your PDF right now. Please try again.",
    };
  }
};

export const generateRecipePdf = async (
  recipe: PdfRecipeInput,
): Promise<PdfGenerationResult> =>
  renderWithCredit(
    RECIPE_PDF_CREDIT_COST,
    buildRecipePdfHtml(recipe),
    toFilename(recipe?.title, "recipe"),
  );

export const generateMealPlanPdf = async (
  plan: PdfMealInput,
): Promise<PdfGenerationResult> =>
  renderWithCredit(
    MEAL_PLAN_PDF_CREDIT_COST,
    buildMealPlanPdfHtml(plan),
    toFilename(plan?.name, "meal-plan"),
  );
