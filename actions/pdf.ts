"use server";

import React from "react";
import { refundCredits, spendCredits } from "@/actions/credits";
import {
  MEAL_PLAN_PDF_CREDIT_COST,
  RECIPE_PDF_CREDIT_COST,
} from "@/constants/creditCosts";
import { renderPdfDocument } from "@/lib/pdf/render";
import { RecipePdfDocument } from "@/components/pdf/RecipePdfDocument";
import { MealPlanPdfDocument } from "@/components/pdf/MealPlanPdfDocument";
import { resolveImageAsDataUri } from "@/lib/pdf/image-helper";
import type { PdfMealInput, PdfRecipeInput } from "@/lib/pdf/templates";

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
  document: React.ReactNode,
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
    const buffer = await renderPdfDocument(document);
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
): Promise<PdfGenerationResult> => {
  let resolvedRecipe = recipe;
  const rawUrl =
    typeof recipe?.image === "string"
      ? recipe.image
      : recipe?.image?.url || (recipe as any)?.image_url;

  if (rawUrl && !rawUrl.startsWith("data:")) {
    const dataUri = await resolveImageAsDataUri(rawUrl);
    resolvedRecipe = {
      ...recipe,
      image: dataUri ? { url: dataUri } : undefined,
    };
  } else if (!rawUrl) {
    resolvedRecipe = {
      ...recipe,
      image: undefined,
    };
  }

  return renderWithCredit(
    RECIPE_PDF_CREDIT_COST,
    React.createElement(RecipePdfDocument, { recipe: resolvedRecipe }),
    toFilename(recipe?.title, "recipe"),
  );
};

export const generateMealPlanPdf = async (
  plan: PdfMealInput,
): Promise<PdfGenerationResult> =>
  renderWithCredit(
    MEAL_PLAN_PDF_CREDIT_COST,
    React.createElement(MealPlanPdfDocument, { plan }),
    toFilename(plan?.name, "meal-plan"),
  );
