"use client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { MealType, mealPlannerType } from "@/schema/meal-planner";
import MealImage from "./MealImage";

const recipePromptFor = (plan: mealPlannerType, meal: MealType) => {
  const nutrition = [
    typeof meal.calories === "number" ? `about ${meal.calories} kcal` : null,
    typeof meal.protein === "number" ? `${meal.protein}g protein` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `Create an Ethiopian-inspired recipe for ${meal.name}.`,
    meal.description,
    nutrition ? `Aim for ${nutrition}.` : null,
    `Keep it suitable for a ${plan.diet} diet and a ${plan.goal.replace("_", " ")} goal.`,
    "Include practical ingredients, serving size, and clear cooking steps.",
  ]
    .filter(Boolean)
    .join(" ");
};

const PreviewSection = ({ plan }: { plan: mealPlannerType }) => {
  const meta = [
    plan.timeframe === "today" ? "Today" : "Full Week",
    plan.goal.replace("_", " "),
    plan.diet,
    plan.calories ? `${plan.calories} kcal/day` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-12 ">
      {/* Plan header */}
      <div>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {meta.map((m, i) => (
            <span key={m} className="inline-flex items-center gap-2">
              {i > 0 && <span className="text-border">·</span>}
              <span className={i === 0 ? "font-semibold text-foreground" : "capitalize"}>
                {m}
              </span>
            </span>
          ))}
        </p>
        <h2 className="mt-3 font-gosh text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {plan.name ?? "Your Meal Plan"}
        </h2>
        {plan.notes && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {plan.notes}
          </p>
        )}
      </div>

      {/* Days */}
      {plan.days.map((d, dayIdx) => (
        <section key={d.day}>
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Day {String(dayIdx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-bold capitalize text-foreground">
                {d.day}
              </h3>
            </div>
            {typeof d.totalCalories === "number" && (
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {d.totalCalories} kcal
              </span>
            )}
          </div>

          {/* Meals */}
          <div className="space-y-12">
            {d.meals.map((m, idx) => (
              <div key={idx}>
                {m.pexels_search_term && (
                  <MealImage searchTerm={m.pexels_search_term} alt={m.name} />
                )}

                <div className="pt-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="text-xl font-bold text-foreground">
                      {m.name}
                    </h4>
                    {typeof m.calories === "number" && (
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {m.calories} kcal
                      </span>
                    )}
                  </div>

                  {m.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {m.description}
                    </p>
                  )}

                  {(typeof m.protein === "number" ||
                    typeof m.carbs === "number" ||
                    typeof m.fat === "number") && (
                    <p className="mt-3 text-sm tabular-nums text-muted-foreground">
                      {[
                        m.protein ? `Protein ${m.protein}g` : null,
                        m.carbs ? `Carbs ${m.carbs}g` : null,
                        m.fat ? `Fat ${m.fat}g` : null,
                      ]
                        .filter(Boolean)
                        .join("  ·  ")}
                    </p>
                  )}

                  <Link
                    href={{
                      pathname: "/ai-features/generate-recipe",
                      query: { prompt: recipePromptFor(plan, m) },
                    }}
                    className="mt-3 inline-block text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    Generate recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Shopping list + Pro tips */}
      {(plan.shopping_list?.length || plan.pro_tips?.length) && (
        <div className="grid gap-10 lg:grid-cols-2">
          {plan.shopping_list?.length ? (
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">
                Shopping list
              </h3>
              <ul className="divide-y divide-border">
                {plan.shopping_list.map((item, idx) => (
                  <li key={idx} className="py-2.5 text-sm text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {plan.pro_tips?.length ? (
            <section>
              <h3 className="mb-3 text-lg font-bold text-foreground">
                Chef&apos;s notes
              </h3>
              <div className="divide-y divide-border">
                {plan.pro_tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="py-3 text-sm leading-relaxed text-foreground [&_p]:m-0"
                  >
                    <ReactMarkdown>{tip}</ReactMarkdown>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
