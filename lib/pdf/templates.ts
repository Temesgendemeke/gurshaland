const BASE_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
    color: #1c2430;
    font-size: 10.5px;
    line-height: 1.55;
    background: #ffffff;
  }
  .doc { padding: 2px 2px 0; }
  .brand { margin: 0 0 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e9ef; }
  .brand-wordmark {
    font-size: 19px; line-height: 1.1; letter-spacing: 7px; font-weight: 800;
    color: #b44022; text-transform: uppercase; margin: 0;
  }
  .brand-tagline {
    font-size: 8.5px; letter-spacing: 2.5px; font-weight: 500; color: #8a94a6;
    text-transform: uppercase; margin: 5px 0 0;
  }
  h1 { font-size: 23px; line-height: 1.15; margin: 0 0 8px; color: #1c2430; }
  .lede { font-size: 10.5px; color: #5c6675; margin: 0 0 14px; max-width: 560px; }
  .rule { border: none; border-top: 1px solid #e5e9ef; margin: 0; }
  .meta { font-size: 9px; color: #5c6675; margin: 10px 0 0; }
  .meta strong { color: #1c2430; font-weight: 600; }
  section { margin-top: 16px; }
  h2 {
    font-size: 9px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;
    color: #b44022; margin: 0 0 8px; padding-bottom: 5px; border-bottom: 1px solid #e5e9ef;
  }
  ul.plain, ol.plain { margin: 0; padding: 0; list-style: none; }
  .row { display: flex; align-items: baseline; gap: 8px; padding: 4px 0; border-bottom: 1px dotted #eef1f5; }
  .row .name { font-weight: 600; }
  .row .amt { margin-left: auto; color: #5c6675; white-space: nowrap; }
  .tip { color: #8a94a6; font-size: 9px; }
  .stats { display: flex; gap: 8px; margin-top: 4px; }
  .stat {
    flex: 1; border: 1px solid #e5e9ef; border-radius: 8px; padding: 8px 10px;
    background: #fafbfc; text-align: center;
  }
  .stat .v { display: block; font-size: 14px; font-weight: 700; color: #1c2430; }
  .stat .l { display: block; font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #8a94a6; margin-top: 2px; }
  .nutgrid { display: flex; gap: 8px; }
  .nut {
    flex: 1; border: 1px solid #f0d4cc; border-radius: 8px; padding: 8px 10px;
    background: #fdf6f3; text-align: center;
  }
  .nut .v { display: block; font-size: 13px; font-weight: 700; color: #b44022; }
  .nut .l { display: block; font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #9a5c48; margin-top: 2px; }
  .step { display: flex; gap: 10px; margin-bottom: 10px; }
  .step .n {
    flex: 0 0 auto; width: 20px; height: 20px; border-radius: 50%; background: #b44022;
    color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center;
    justify-content: center; margin-top: 1px;
  }
  .step .t { font-weight: 600; }
  .step .d { color: #3a4353; margin-top: 1px; }
  .day { border: 1px solid #e5e9ef; border-radius: 10px; overflow: hidden; margin-top: 12px; break-inside: avoid; }
  .day-head {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px;
    background: #fafbfc; border-bottom: 1px solid #e5e9ef;
  }
  .day-num {
    width: 22px; height: 22px; border-radius: 6px; background: #b44022; color: #fff;
    font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  }
  .day-head h3 { margin: 0; font-size: 13px; text-transform: capitalize; }
  .day-head .kcal { margin-left: auto; font-size: 9px; color: #5c6675; }
  table.meals { width: 100%; border-collapse: collapse; font-size: 9.5px; }
  table.meals th {
    text-align: left; padding: 5px 12px; background: #fafbfc; color: #8a94a6;
    text-transform: uppercase; font-size: 7.5px; letter-spacing: 1px; border-bottom: 1px solid #e5e9ef;
  }
  table.meals td { padding: 7px 12px; border-bottom: 1px dotted #eef1f5; vertical-align: top; }
  table.meals tr:last-child td { border-bottom: none; }
  table.meals td.num { text-align: right; white-space: nowrap; }
  table.meals th.num { text-align: right; }
  table.meals .desc { color: #5c6675; font-size: 9px; margin-top: 1px; }
  ul.list { margin: 0; padding: 0; list-style: none; }
  ul.list li { display: flex; gap: 8px; padding: 4px 0; border-bottom: 1px dotted #eef1f5; }
  ul.list li .dot {
    flex: 0 0 auto; width: 5px; height: 5px; border-radius: 50%; background: #b44022;
    margin-top: 5px;
  }
  .notes {
    margin-top: 12px; padding: 8px 12px; border-left: 3px solid #b44022;
    background: #fafbfc; border-radius: 0 8px 8px 0;
  }
  .notes p { margin: 0; }
  .notes .nl { font-weight: 600; }
  .disclaimer {
    margin-top: 22px; padding-top: 10px; border-top: 1px solid #e5e9ef;
    color: #8a94a6; font-size: 8px; line-height: 1.5;
  }
  .hero-img { width: 100%; border-radius: 10px; object-fit: cover; max-height: 260px; margin-bottom: 14px; }
  .step-img { width: 56px; height: 56px; border-radius: 6px; object-fit: cover; flex-shrink: 0; margin-top: 1px; }
  .step { align-items: flex-start; }
  .badges { display: flex; gap: 6px; flex-wrap: wrap; }
  .badge {
    border: 1px solid #e5e9ef; border-radius: 999px; padding: 2px 8px;
    font-size: 8px; color: #5c6675; background: #fafbfc;
  }
`;

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const stripMarkdown = (value: string): string =>
  escapeHtml(
    value
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_`~]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );

const fmt = (value: unknown, suffix = ""): string => {
  if (value === undefined || value === null || value === "") return "—";
  const n = Number(value);
  return `${Number.isFinite(n) ? n : escapeHtml(value)}${suffix}`;
};

const brand = `
  <div class="brand">
    <p class="brand-wordmark">Gurshaland</p>
    <p class="brand-tagline">Ethiopian Recipes &middot; Shared with Love</p>
  </div>`;

export type PdfRecipeInput = {
  title?: string;
  description?: string;
  category?: string | { name?: string };
  tags?: string[];
  preptime?: number;
  cooktime?: number;
  servings?: number;
  difficulty?: string;
  image?: { url?: string };
  ingredients?: Array<{
    item?: string;
    amount?: number | string | null;
    unit?: string | null;
    tips?: string;
  }>;
  instructions?: Array<{
    step?: number;
    title?: string;
    description?: string;
    tips?: string;
    image?: { url?: string };
  }>;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
};

export type PdfMealInput = {
  name?: string;
  timeframe?: string;
  goal?: string;
  diet?: string;
  calories?: number;
  meals_per_day?: number;
  notes?: string;
  days?: Array<{
    day?: string;
    totalCalories?: number;
    total_calories?: number;
    meals?: Array<{
      name?: string;
      description?: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    }>;
  }>;
  shopping_list?: string[];
  pro_tips?: string[];
};

const wrap = (content: string, title: string): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>${BASE_CSS}</style>
</head>
<body>
<div class="doc">${content}</div>
</body>
</html>`;

export const buildRecipePdfHtml = (recipe: PdfRecipeInput): string => {
  const category =
    typeof recipe.category === "string"
      ? recipe.category
      : recipe.category?.name ?? "";
  const tags = recipe.tags ?? [];

  const ingredients = (recipe.ingredients ?? [])
    .filter((i) => i.item)
    .map(
      (i) => `
      <li class="row">
        <span class="name">${escapeHtml(i.item)}</span>
        <span class="amt">${fmt(i.amount, i.unit ? ` ${escapeHtml(i.unit)}` : "")}</span>
      </li>
      ${i.tips ? `<li class="tip">${escapeHtml(i.tips)}</li>` : ""}`,
    )
    .join("");

  const instructions = (recipe.instructions ?? [])
    .map(
      (s, idx) => `
      <li class="step">
        <span class="n">${s.step ?? idx + 1}</span>
        ${s.image?.url ? `<img class="step-img" src="${escapeHtml(s.image.url)}" alt="Step ${s.step ?? idx + 1}" />` : ""}
        <div>
          ${s.title ? `<div class="t">${escapeHtml(s.title)}</div>` : ""}
          ${s.description ? `<div class="d">${escapeHtml(s.description)}</div>` : ""}
          ${s.tips ? `<div class="tip">Tip: ${escapeHtml(s.tips)}</div>` : ""}
        </div>
      </li>`,
    )
    .join("");

  const hasNutrition =
    recipe.nutrition && Object.values(recipe.nutrition).some((v) => v != null);

  const stat = (label: string, value: string) => `
    <div class="stat"><span class="v">${value}</span><span class="l">${label}</span></div>`;

  const totalTime =
    recipe.preptime != null && recipe.cooktime != null
      ? fmt(Number(recipe.preptime) + Number(recipe.cooktime), " min")
      : "—";

  const content = `
    ${brand}
    ${recipe.image?.url ? `<img class="hero-img" src="${escapeHtml(recipe.image.url)}" alt="${escapeHtml(recipe.title ?? "Recipe")}" />` : ""}
    <h1>${escapeHtml(recipe.title ?? "Recipe")}</h1>
    ${recipe.description ? `<p class="lede">${escapeHtml(recipe.description)}</p>` : ""}
    ${category ? `<div class="badges"><span class="badge">${escapeHtml(category)}</span>${tags
      .map((t) => `<span class="badge">${escapeHtml(t)}</span>`)
      .join("")}</div>` : ""}
    <div class="stats">
      ${stat("Total time", totalTime)}
      ${stat("Prep", fmt(recipe.preptime, " min"))}
      ${stat("Cook", fmt(recipe.cooktime, " min"))}
      ${stat("Servings", fmt(recipe.servings))}
      ${stat("Difficulty", escapeHtml(recipe.difficulty ?? "—"))}
    </div>
    <section>
      <h2>Ingredients</h2>
      <ul class="plain">${ingredients || `<li class="row"><span class="name">—</span></li>`}</ul>
    </section>
    ${
      hasNutrition
        ? `<section>
      <h2>Nutrition per serving</h2>
      <div class="nutgrid">
        ${stat("Calories", fmt(recipe.nutrition?.calories, " kcal"))}
        ${stat("Protein", fmt(recipe.nutrition?.protein, " g"))}
        ${stat("Carbs", fmt(recipe.nutrition?.carbs, " g"))}
        ${stat("Fat", fmt(recipe.nutrition?.fat, " g"))}
        ${stat("Fiber", fmt(recipe.nutrition?.fiber, " g"))}
      </div>
    </section>`
        : ""
    }
    <section>
      <h2>Instructions</h2>
      <ol class="plain">${instructions || `<li class="step"><span class="n">1</span><div class="d">—</div></li>`}</ol>
    </section>
    <div class="disclaimer">
      Nutritional values are estimates. Check ingredients for personal allergies before
      cooking.
    </div>`;

  return wrap(content, recipe.title ?? "Recipe");
};

export const buildMealPlanPdfHtml = (plan: PdfMealInput): string => {
  const meta = [
    plan.timeframe === "full-week" ? "Full week" : plan.timeframe ? "Today" : null,
    plan.goal ? escapeHtml(plan.goal.replace(/_/g, " ")) : null,
    plan.diet ? escapeHtml(plan.diet) : null,
    plan.meals_per_day ? `${plan.meals_per_day} meals/day` : null,
    plan.calories ? `${plan.calories} kcal/day` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const days = (plan.days ?? []).map(
    (d, idx) => `
    <div class="day">
      <div class="day-head">
        <span class="day-num">${String(idx + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(d.day ?? `Day ${idx + 1}`)}</h3>
        <span class="kcal">${fmt(d.totalCalories ?? d.total_calories, " kcal")}</span>
      </div>
      <table class="meals">
        <thead>
          <tr>
            <th>Meal</th>
            <th class="num">Cal</th>
            <th class="num">Protein</th>
            <th class="num">Carbs</th>
            <th class="num">Fat</th>
          </tr>
        </thead>
        <tbody>
          ${(d.meals ?? [])
            .map(
              (m) => `
            <tr>
              <td>
                <strong>${escapeHtml(m.name ?? "—")}</strong>
                ${m.description ? `<div class="desc">${escapeHtml(m.description)}</div>` : ""}
              </td>
              <td class="num">${fmt(m.calories)}</td>
              <td class="num">${fmt(m.protein)}</td>
              <td class="num">${fmt(m.carbs)}</td>
              <td class="num">${fmt(m.fat)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`,
  ).join("");

  const shopping = (plan.shopping_list ?? []).map(
    (item) => `<li><span class="dot"></span><span>${escapeHtml(item)}</span></li>`,
  ).join("");

  const tips = (plan.pro_tips ?? []).map(
    (tip) => `<li><span class="dot"></span><span>${stripMarkdown(tip)}</span></li>`,
  ).join("");

  const content = `
    ${brand}
    <h1>${escapeHtml(plan.name ?? "Your Meal Plan")}</h1>
    <p class="lede">${meta || "Personalized Ethiopian meal plan"}</p>
    ${plan.notes ? `<div class="notes"><p><span class="nl">Notes.</span> ${escapeHtml(plan.notes)}</p></div>` : ""}
    ${days}
    ${
      shopping
        ? `<section><h2>Shopping list</h2><ul class="list">${shopping}</ul></section>`
        : ""
    }
    ${
      tips
        ? `<section><h2>Chef's notes</h2><ul class="list">${tips}</ul></section>`
        : ""
    }
    <div class="disclaimer">
      This plan is not medical advice — consult a healthcare professional for personalized
      nutrition guidance.
    </div>`;

  return wrap(content, plan.name ?? "Meal Plan");
};
