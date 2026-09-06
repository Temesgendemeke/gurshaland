import React from "react";
import { Document, Page, View, StyleSheet } from "@/lib/pdf-primitives";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { gurshalandPdfTheme } from "@/components/pdf/theme-gurshaland";
import { PageHeader } from "@/components/pdf/page-header/page-header";
import { PageFooter } from "@/components/pdf/page-footer/page-footer";
import { Text } from "@/components/pdf/text/text";
import type { PdfRecipeInput } from "@/lib/pdf/templates";

export interface RecipePdfDocumentProps {
  recipe: PdfRecipeInput & {
    culturalNote?: string;
    author?: { full_name?: string; name?: string; username?: string };
  };
}

// Convert decimals to culinary fractions (e.g. 1.5 -> 1 1/2, 0.25 -> 1/4)
function formatAmount(amount: number | string | null | undefined): string {
  if (amount == null) return "";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);

  const whole = Math.floor(num);
  const frac = Math.round((num - whole) * 100) / 100;

  let fracStr = "";
  if (Math.abs(frac - 0.25) < 0.03) fracStr = "1/4";
  else if (Math.abs(frac - 0.33) < 0.04) fracStr = "1/3";
  else if (Math.abs(frac - 0.5) < 0.03) fracStr = "1/2";
  else if (Math.abs(frac - 0.67) < 0.04) fracStr = "2/3";
  else if (Math.abs(frac - 0.75) < 0.03) fracStr = "3/4";
  else if (frac > 0) fracStr = String(frac).replace(/^0/, "");

  if (whole > 0 && fracStr) return `${whole} ${fracStr}`;
  if (whole > 0) return `${whole}`;
  if (fracStr) return fracStr;
  return `${num}`;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 32,
    fontFamily: "Helvetica",
    color: "#18181b",
    display: "flex",
    flexDirection: "column",
  },
  headerWrap: {
    marginBottom: 10,
  },
  // Recipe Header & Title
  titleBlock: {
    marginBottom: 10,
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    fontWeight: 700,
    color: "#18181b",
    lineHeight: 1.18,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  byline: {
    fontSize: 8.5,
    color: "#71717a",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  description: {
    fontFamily: "Times-Roman",
    fontSize: 9.5,
    fontStyle: "italic",
    color: "#44403c",
    lineHeight: 1.45,
    marginBottom: 8,
  },
  // Classic Typographic Meta Bar
  metaBar: {
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    borderBottomStyle: "solid",
    paddingVertical: 5,
    marginBottom: 14,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  metaLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    color: "#78716c",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metaValue: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#1c1917",
  },
  metaDivider: {
    fontSize: 8,
    color: "#d6d3d1",
  },
  // Classic 2-Column Cookbook Layout
  columns: {
    display: "flex",
    flexDirection: "row",
    gap: 22,
    alignItems: "flex-start",
  },
  // Left Column (Ingredients & Image)
  colIngredients: {
    width: "36%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  recipePhoto: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e7e5e4",
  },
  sectionHeading: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#c03622",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    fontWeight: 700,
    color: "#1c1917",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionSubtext: {
    fontSize: 7.5,
    color: "#78716c",
  },
  ingredientList: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  ingredientItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 3.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f5f5f4",
    borderBottomStyle: "solid",
  },
  bulletDot: {
    width: 3.5,
    height: 3.5,
    backgroundColor: "#c03622",
    borderRadius: 1,
    marginTop: 4,
    marginRight: 6,
    flexShrink: 0,
  },
  ingText: {
    fontSize: 8.5,
    color: "#292524",
    lineHeight: 1.35,
    flex: 1,
  },
  ingAmount: {
    fontWeight: 700,
    color: "#1c1917",
  },
  ingTip: {
    fontSize: 7.5,
    color: "#78716c",
    fontStyle: "italic",
  },
  // Nutrition Block
  nutritionBlock: {
    backgroundColor: "#fafaf9",
    borderLeftWidth: 2,
    borderLeftColor: "#a8a29e",
    borderLeftStyle: "solid",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginTop: 4,
  },
  nutritionHeading: {
    fontSize: 7,
    fontWeight: 700,
    color: "#78716c",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  nutritionText: {
    fontSize: 8,
    color: "#44403c",
    lineHeight: 1.3,
  },
  // Cultural / Chef Note
  culturalBlock: {
    backgroundColor: "#fefbf6",
    borderLeftWidth: 2,
    borderLeftColor: "#c03622",
    borderLeftStyle: "solid",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginTop: 4,
  },
  culturalTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: "#9a3412",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  culturalText: {
    fontFamily: "Times-Roman",
    fontSize: 8,
    color: "#78716c",
    fontStyle: "italic",
    lineHeight: 1.35,
  },
  // Right Column (Method / Preparation)
  colMethod: {
    width: "64%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  stepItem: {
    display: "flex",
    flexDirection: "row",
    gap: 9,
    marginBottom: 9,
    breakInside: "avoid",
  },
  stepNumberBadge: {
    width: 17,
    height: 17,
    borderRadius: 3,
    backgroundColor: "#27272a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 8.5,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
  stepBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  stepTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#18181b",
    marginBottom: 2,
    lineHeight: 1.25,
  },
  stepText: {
    fontSize: 8.5,
    color: "#3f3f46",
    lineHeight: 1.45,
  },
  stepTip: {
    fontSize: 7.5,
    color: "#991b1b",
    fontStyle: "italic",
    marginTop: 2.5,
  },
});

export const RecipePdfDocument: React.FC<RecipePdfDocumentProps> = ({
  recipe,
}) => {
  const category =
    typeof recipe.category === "string"
      ? recipe.category
      : recipe.category?.name ?? "";

  const totalTime =
    recipe.preptime != null && recipe.cooktime != null
      ? `${Number(recipe.preptime) + Number(recipe.cooktime)} min`
      : null;

  const authorName =
    recipe.author?.full_name || recipe.author?.name || recipe.author?.username;

  const hasNutrition =
    recipe.nutrition && Object.values(recipe.nutrition).some((v) => v != null);

  const ingredients = recipe.ingredients ?? [];
  const instructions = recipe.instructions ?? [];

  // Extract cover image safely from object or string
  const imageUrl =
    typeof recipe.image === "string"
      ? recipe.image
      : recipe.image?.url || (recipe as any)?.image_url;

  return (
    <PdfcnThemeProvider theme={gurshalandPdfTheme}>
      <Document title={recipe.title ?? "Recipe"}>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.headerWrap}>
            <PageHeader
              variant="minimal"
              title="Gurshaland"
              subtitle="Ethiopian Culinary Archive · Print Edition"
              rightText="Authentic Recipe"
              rightSubText={category || undefined}
              marginBottom={10}
            />
          </View>

          {/* Title Block */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{recipe.title ?? "Recipe"}</Text>

            {authorName && (
              <Text style={styles.byline}>
                Contributed by {authorName} · Gurshaland Archive
              </Text>
            )}

            {recipe.description && (
              <Text style={styles.description}>{recipe.description}</Text>
            )}
          </View>

          {/* Clean Typographic Meta Bar (No SaaS dashboard cards) */}
          <View style={styles.metaBar}>
            {totalTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Total Time:</Text>
                <Text style={styles.metaValue}>{totalTime}</Text>
              </View>
            )}
            {recipe.preptime != null && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Prep:</Text>
                  <Text style={styles.metaValue}>{recipe.preptime} min</Text>
                </View>
              </>
            )}
            {recipe.cooktime != null && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Cook:</Text>
                  <Text style={styles.metaValue}>{recipe.cooktime} min</Text>
                </View>
              </>
            )}
            {recipe.servings != null && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Yield:</Text>
                  <Text style={styles.metaValue}>{recipe.servings} servings</Text>
                </View>
              </>
            )}
            {recipe.difficulty && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Difficulty:</Text>
                  <Text style={styles.metaValue}>{recipe.difficulty}</Text>
                </View>
              </>
            )}
            {category && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Category:</Text>
                  <Text style={styles.metaValue}>{category}</Text>
                </View>
              </>
            )}
          </View>

          {/* Classic 2-Column Cookbook Layout */}
          <View style={styles.columns}>
            {/* Left Column: Cover Photo (if available) + Ingredients + Nutrition */}
            <View style={styles.colIngredients}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={recipe.title ?? "Recipe"}
                  style={styles.recipePhoto as React.CSSProperties}
                />
              )}

              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Text style={styles.sectionSubtext}>{ingredients.length} items</Text>
              </View>

              <View style={styles.ingredientList}>
                {ingredients.length === 0 ? (
                  <Text style={{ fontSize: 8.5, color: "#78716c" }}>
                    No ingredients listed.
                  </Text>
                ) : (
                  ingredients.map((ing, idx) => {
                    const formatted = formatAmount(ing.amount);
                    const unitStr = ing.unit ? ` ${ing.unit}` : "";
                    const amountStr = formatted ? `${formatted}${unitStr}` : "";

                    return (
                      <View
                        key={`ing-${ing.item}-${idx}`}
                        style={styles.ingredientItem}
                      >
                        <View style={styles.bulletDot} />
                        <Text style={styles.ingText}>
                          {amountStr && (
                            <Text style={styles.ingAmount}>{amountStr} </Text>
                          )}
                          {ing.item}
                          {ing.tips && (
                            <Text style={styles.ingTip}> ({ing.tips})</Text>
                          )}
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>

              {/* Nutrition */}
              {hasNutrition && (
                <View style={styles.nutritionBlock}>
                  <Text style={styles.nutritionHeading}>
                    Nutritional Estimate (Per Serving)
                  </Text>
                  <Text style={styles.nutritionText}>
                    {recipe.nutrition?.calories != null
                      ? `${recipe.nutrition.calories} calories`
                      : ""}
                    {recipe.nutrition?.protein != null
                      ? ` · ${recipe.nutrition.protein}g protein`
                      : ""}
                    {recipe.nutrition?.carbs != null
                      ? ` · ${recipe.nutrition.carbs}g carbs`
                      : ""}
                    {recipe.nutrition?.fat != null
                      ? ` · ${recipe.nutrition.fat}g fat`
                      : ""}
                  </Text>
                </View>
              )}

              {/* Cultural Note / Heritage */}
              {recipe.culturalNote && (
                <View style={styles.culturalBlock}>
                  <Text style={styles.culturalTitle}>Heritage & Origin</Text>
                  <Text style={styles.culturalText}>{recipe.culturalNote}</Text>
                </View>
              )}
            </View>

            {/* Right Column: Method / Steps */}
            <View style={styles.colMethod}>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Method & Preparation</Text>
                <Text style={styles.sectionSubtext}>
                  {instructions.length} steps
                </Text>
              </View>

              {instructions.length === 0 ? (
                <Text style={{ fontSize: 8.5, color: "#71717a" }}>
                  Refer to online guide for preparation steps.
                </Text>
              ) : (
                instructions.map((step, idx) => (
                  <View
                    key={step.step ?? idx}
                    style={styles.stepItem}
                    wrap={false}
                  >
                    <View style={styles.stepNumberBadge}>
                      <span>{step.step ?? idx + 1}</span>
                    </View>
                    <View style={styles.stepBody}>
                      {step.title && (
                        <Text style={styles.stepTitle}>{step.title}</Text>
                      )}
                      {step.description && (
                        <Text style={styles.stepText}>{step.description}</Text>
                      )}
                      {step.tips && (
                        <Text style={styles.stepTip}>
                          Pro Tip: {step.tips}
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          <PageFooter
            leftText="Gurshaland · Ethiopian Culinary Archive"
            rightText="Page 1 of 1"
            sticky
            pagePadding={20}
          />
        </Page>
      </Document>
    </PdfcnThemeProvider>
  );
};
