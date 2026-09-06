import React from "react";
import { Document, Page, View, StyleSheet } from "@/lib/pdf-primitives";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { gurshalandPdfTheme } from "@/components/pdf/theme-gurshaland";
import { PageHeader } from "@/components/pdf/page-header/page-header";
import { Text } from "@/components/pdf/text/text";
import type { PdfMealInput } from "@/lib/pdf/templates";

export interface MealPlanPdfDocumentProps {
  plan: PdfMealInput;
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
  // Document Headline Block
  titleBlock: {
    marginBottom: 8,
  },
  preTitle: {
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#c03622",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8.5,
    color: "#6b7280",
    letterSpacing: 0.2,
  },
  // Typographic Metadata Bar
  metaBar: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingVertical: 6,
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 14,
  },
  metaItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  metaLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metaValue: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#1f2937",
  },
  metaDivider: {
    fontSize: 8,
    color: "#d1d5db",
  },
  // Chef's Editorial Note (Pullquote style)
  editorialNote: {
    borderLeftWidth: 2.5,
    borderLeftColor: "#c03622",
    borderLeftStyle: "solid",
    paddingLeft: 10,
    paddingVertical: 4,
    marginBottom: 14,
    backgroundColor: "#fafaf9",
    borderRadius: 2,
  },
  editorialText: {
    fontFamily: "Times-Roman",
    fontSize: 9,
    fontStyle: "italic",
    color: "#374151",
    lineHeight: 1.45,
  },
  // Section Headings
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#c03622",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#111827",
  },
  sectionCount: {
    fontSize: 8,
    color: "#6b7280",
  },
  // Day Container & Day Cards
  daysContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 14,
  },
  dayCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
    borderRadius: 6,
    overflow: "hidden",
  },
  dayHeader: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingHorizontal: 10,
    paddingVertical: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayTitleWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayBadge: {
    backgroundColor: "#c03622",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
  },
  dayBadgeText: {
    color: "#ffffff",
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  dayTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: 0.3,
  },
  dayKcal: {
    fontSize: 8,
    fontWeight: 600,
    color: "#6b7280",
  },
  // Meals Layout
  mealsGrid: {
    padding: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mealBox: {
    flex: 1,
    minWidth: 130,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderStyle: "solid",
    borderRadius: 5,
    padding: 7,
  },
  mealType: {
    fontSize: 7,
    fontWeight: 700,
    color: "#c03622",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 9,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.25,
    marginBottom: 2,
  },
  mealDesc: {
    fontSize: 7.5,
    color: "#4b5563",
    lineHeight: 1.35,
    marginBottom: 4,
  },
  mealMacros: {
    fontSize: 7,
    color: "#4b5563",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  // Bottom 2-Column: Checklist & Preparation Notes
  bottomRow: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
  },
  bottomCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fafaf9",
  },
  colHeading: {
    fontSize: 8.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 8,
  },
  checklistGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  checkItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontSize: 8,
    color: "#374151",
  },
  checkSquare: {
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderStyle: "solid",
    borderRadius: 1.5,
  },
  checkText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.3,
  },
  tipItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    marginBottom: 5,
  },
  tipDot: {
    width: 3.5,
    height: 3.5,
    backgroundColor: "#c03622",
    borderRadius: 2,
    marginTop: 3.5,
  },
  tipText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.4,
    flex: 1,
  },
});

export const MealPlanPdfDocument: React.FC<MealPlanPdfDocumentProps> = ({
  plan,
}) => {
  const goalFormatted = plan.goal ? plan.goal.replace(/_/g, " ").toUpperCase() : null;
  const daysList = plan.days ?? [];
  const totalMealsCount = daysList.reduce(
    (acc, d) => acc + (d.meals?.length ?? 0),
    0,
  );

  return (
    <PdfcnThemeProvider theme={gurshalandPdfTheme}>
      <Document title={plan.name ?? "Meal Plan"}>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.headerWrap}>
            <PageHeader
              variant="minimal"
              title="Gurshaland"
              subtitle="Personalized Ethiopian Meal Plan · Print Edition"
              rightText="Nutritional Archive"
              rightSubText={goalFormatted || undefined}
              marginBottom={10}
            />
          </View>

          {/* Title Area */}
          <View style={styles.titleBlock}>
            <Text style={styles.preTitle}>Tailored Nutritional Program</Text>
            <Text style={styles.title}>{plan.name ?? "Personalized Meal Plan"}</Text>
            <Text style={styles.subtitle}>
              Customized Ethiopian culinary schedule designed for optimal health and flavor.
            </Text>
          </View>

          {/* Typographic Metadata Bar */}
          <View style={styles.metaBar}>
            {goalFormatted && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Goal</Text>
                <Text style={styles.metaValue}>{goalFormatted}</Text>
              </View>
            )}
            <Text style={styles.metaDivider}>·</Text>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{daysList.length} Days</Text>
            </View>
            {plan.meals_per_day ? (
              <>
                <Text style={styles.metaDivider}>·</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Schedule</Text>
                  <Text style={styles.metaValue}>{plan.meals_per_day} meals/day</Text>
                </View>
              </>
            ) : null}
            {plan.calories ? (
              <>
                <Text style={styles.metaDivider}>·</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Target</Text>
                  <Text style={styles.metaValue}>~{plan.calories} kcal/day</Text>
                </View>
              </>
            ) : null}
            {plan.diet ? (
              <>
                <Text style={styles.metaDivider}>·</Text>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Diet</Text>
                  <Text style={styles.metaValue}>{plan.diet}</Text>
                </View>
              </>
            ) : null}
          </View>

          {/* Chef's Editorial Pullquote */}
          {plan.notes && (
            <View style={styles.editorialNote}>
              <Text style={styles.editorialText}>&ldquo;{plan.notes}&rdquo;</Text>
            </View>
          )}

          {/* Day-by-Day Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Meal Itinerary</Text>
            <Text style={styles.sectionCount}>
              {daysList.length} Days · {totalMealsCount} Prepared Courses
            </Text>
          </View>

          <View style={styles.daysContainer}>
            {daysList.map((d, dayIdx) => {
              const dayKcal = d.totalCalories ?? d.total_calories;
              return (
                <View key={d.day ?? dayIdx} style={styles.dayCard} wrap={false}>
                  {/* Day Header */}
                  <View style={styles.dayHeader}>
                    <View style={styles.dayTitleWrap}>
                      <View style={styles.dayBadge}>
                        <Text style={styles.dayBadgeText}>
                          {String(dayIdx + 1).padStart(2, "0")}
                        </Text>
                      </View>
                      <Text style={styles.dayTitle}>
                        {d.day ? d.day.toUpperCase() : `DAY ${dayIdx + 1}`}
                      </Text>
                    </View>
                    {dayKcal ? (
                      <Text style={styles.dayKcal}>{dayKcal} kcal total</Text>
                    ) : null}
                  </View>

                  {/* Meals Grid */}
                  <View style={styles.mealsGrid}>
                    {(d.meals ?? []).map((m, mIdx) => {
                      const macroParts = [
                        m.calories ? `${m.calories} kcal` : null,
                        m.protein ? `${m.protein}g P` : null,
                        m.carbs ? `${m.carbs}g C` : null,
                        m.fat ? `${m.fat}g F` : null,
                      ].filter(Boolean);

                      return (
                        <View key={`${m.name}-${mIdx}`} style={styles.mealBox}>
                          <Text style={styles.mealType}>
                            {m.type || `Meal ${mIdx + 1}`}
                          </Text>
                          <Text style={styles.mealName}>{m.name ?? "—"}</Text>
                          {m.description && (
                            <Text style={styles.mealDesc}>{m.description}</Text>
                          )}
                          {macroParts.length > 0 && (
                            <Text style={styles.mealMacros}>
                              {macroParts.join(" · ")}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Grocery Checklist & Chef's Notes */}
          {((plan.shopping_list ?? []).length > 0 ||
            (plan.pro_tips ?? []).length > 0) && (
            <View style={styles.bottomRow} wrap={false}>
              {(plan.shopping_list ?? []).length > 0 && (
                <View style={styles.bottomCol}>
                  <Text style={styles.colHeading}>
                    Grocery Checklist ({plan.shopping_list?.length} Items)
                  </Text>
                  <View style={styles.checklistGrid}>
                    {(plan.shopping_list ?? []).map((item, idx) => (
                      <View key={`${item}-${idx}`} style={styles.checkItem}>
                        <View style={styles.checkSquare} />
                        <Text style={styles.checkText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {(plan.pro_tips ?? []).length > 0 && (
                <View style={styles.bottomCol}>
                  <Text style={styles.colHeading}>Chef&apos;s Culinary Guidance</Text>
                  <View>
                    {(plan.pro_tips ?? []).map((tip, idx) => (
                      <View key={idx} style={styles.tipItem}>
                        <View style={styles.tipDot} />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </Page>
      </Document>
    </PdfcnThemeProvider>
  );
};
