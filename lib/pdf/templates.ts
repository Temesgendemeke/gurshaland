const BASE_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #18181b;
    font-size: 10px;
    line-height: 1.5;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .doc { padding: 4px 4px 0; }
  
  /* Brand Header */
  .brand-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #18181b;
    margin-bottom: 16px;
  }
  .brand-logo {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .brand-mark {
    width: 20px;
    height: 20px;
    background: #c03622;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    font-family: Georgia, serif;
  }
  .brand-name {
    font-family: Georgia, serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.2px;
    color: #18181b;
    margin: 0;
  }
  .brand-label {
    font-size: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #71717a;
    margin: 0;
  }
  
  /* Titles & Headings */
  h1.title {
    font-family: Georgia, serif;
    font-size: 26px;
    line-height: 1.15;
    font-weight: 700;
    color: #18181b;
    margin: 0 0 6px;
    letter-spacing: -0.3px;
  }
  .subtitle {
    font-size: 11px;
    color: #52525b;
    line-height: 1.45;
    margin: 0 0 12px;
    max-width: 620px;
  }
  
  /* Meta Summary Bar */
  .meta-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    margin-bottom: 18px;
  }
  .meta-item {
    display: flex;
    align-items: baseline;
    gap: 5px;
    font-size: 9.5px;
  }
  .meta-item .label {
    color: #71717a;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
  }
  .meta-item .val {
    font-weight: 600;
    color: #18181b;
  }
  .meta-sep {
    color: #d4d4d8;
  }
  
  /* Section Headers */
  .sec-title {
    font-size: 8.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    color: #c03622;
    margin: 0 0 10px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e4e4e7;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sec-title span.count {
    color: #a1a1aa;
    font-weight: 500;
  }
  
  /* Two-Column Recipe Layout */
  .recipe-grid {
    display: flex;
    gap: 22px;
    align-items: flex-start;
  }
  .col-side {
    width: 38%;
    flex-shrink: 0;
  }
  .col-main {
    flex: 1;
    min-width: 0;
  }
  
  /* Recipe Image */
  .recipe-thumb {
    width: 100%;
    height: 170px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    margin-bottom: 14px;
  }
  
  /* Ingredients List */
  .ing-list {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;
  }
  .ing-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px dashed #f0f0f2;
    font-size: 9.5px;
  }
  .ing-item .name {
    font-weight: 500;
    color: #27272a;
    padding-right: 8px;
  }
  .ing-item .amt {
    font-weight: 600;
    color: #18181b;
    white-space: nowrap;
  }
  .ing-tip {
    font-size: 8px;
    color: #71717a;
    font-style: italic;
    padding-bottom: 4px;
  }
  
  /* Nutrition Box */
  .nutrition-box {
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    padding: 10px 12px;
    margin-top: 14px;
  }
  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    text-align: center;
    margin-top: 6px;
  }
  .nut-stat .v {
    font-size: 12px;
    font-weight: 700;
    color: #18181b;
    display: block;
  }
  .nut-stat .l {
    font-size: 7.5px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #71717a;
    font-weight: 500;
  }
  
  /* Instructions */
  .step-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .step-item {
    display: flex;
    gap: 12px;
    margin-bottom: 13px;
    page-break-inside: avoid;
  }
  .step-num {
    flex: 0 0 20px;
    height: 20px;
    border-radius: 6px;
    background: #18181b;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }
  .step-body {
    flex: 1;
    min-width: 0;
  }
  .step-title {
    font-weight: 700;
    font-size: 10.5px;
    color: #18181b;
    margin-bottom: 2px;
  }
  .step-text {
    color: #3f3f46;
    font-size: 9.5px;
    line-height: 1.55;
  }
  .step-tip {
    font-size: 8.5px;
    color: #c03622;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    border-radius: 5px;
    padding: 4px 8px;
    margin-top: 5px;
    display: inline-block;
  }
  
  /* Meal Plan Layout */
  .meal-plan-intro {
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 18px;
    font-style: italic;
    font-family: Georgia, serif;
    font-size: 10.5px;
    color: #3f3f46;
    line-height: 1.5;
  }
  
  .day-card {
    border: 1px solid #e4e4e7;
    border-radius: 10px;
    margin-bottom: 14px;
    page-break-inside: avoid;
    overflow: hidden;
  }
  .day-header {
    background: #fafafa;
    border-bottom: 1px solid #e4e4e7;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .day-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .day-badge {
    background: #c03622;
    color: #ffffff;
    font-size: 8.5px;
    font-weight: 700;
    font-mono: true;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .day-title {
    font-size: 12px;
    font-weight: 700;
    color: #18181b;
    text-transform: capitalize;
    margin: 0;
  }
  .day-kcal {
    font-size: 9.5px;
    font-weight: 600;
    color: #71717a;
  }
  
  /* Meals Grid inside Day */
  .day-meals {
    padding: 10px 14px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }
  .meal-box {
    background: #ffffff;
    border: 1px solid #f4f4f5;
    border-radius: 6px;
    padding: 8px 10px;
  }
  .meal-type {
    font-size: 7.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #c03622;
    margin-bottom: 3px;
  }
  .meal-name {
    font-size: 10.5px;
    font-weight: 700;
    color: #18181b;
    margin-bottom: 3px;
    line-height: 1.3;
  }
  .meal-desc {
    font-size: 8.5px;
    color: #71717a;
    line-height: 1.4;
    margin-bottom: 6px;
  }
  .meal-macros {
    font-size: 8px;
    font-weight: 600;
    color: #52525b;
    background: #fafafa;
    border-radius: 4px;
    padding: 3px 6px;
    display: inline-block;
  }
  
  /* Two-column Bottom: Shopping List & Chef Guidance */
  .two-col-bottom {
    display: flex;
    gap: 20px;
    margin-top: 18px;
    page-break-inside: avoid;
  }
  .two-col-item {
    flex: 1;
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    padding: 12px 14px;
  }
  .checklist {
    list-style: none;
    padding: 0;
    margin: 0;
    columns: 2;
    column-gap: 16px;
  }
  .checklist li {
    font-size: 9px;
    color: #27272a;
    padding: 3px 0;
    display: flex;
    align-items: baseline;
    gap: 6px;
    break-inside: avoid;
  }
  .checklist .chk {
    width: 9px;
    height: 9px;
    border: 1px solid #a1a1aa;
    border-radius: 2px;
    flex-shrink: 0;
  }
  
  .guidance-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .guidance-list li {
    font-size: 9px;
    color: #3f3f46;
    padding: 4px 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.45;
  }
  .guidance-dot {
    width: 4px;
    height: 4px;
    background: #c03622;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
  }
  
  /* Footer Disclaimer */
  .doc-footer {
    margin-top: 24px;
    padding-top: 10px;
    border-top: 1px solid #e4e4e7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 7.5px;
    color: #a1a1aa;
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

const brandMarkup = `
  <div class="brand-header">
    <div class="brand-logo">
      <div class="brand-mark">ጉ</div>
      <h3 class="brand-name">Gurshaland</h3>
    </div>
    <div class="brand-label">Ethiopian Culinary Archive · Print Edition</div>
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
      type?: string;
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

  const ingredientsList = (recipe.ingredients ?? [])
    .filter((i) => i.item)
    .map(
      (i) => `
      <li class="ing-item">
        <span class="name">${escapeHtml(i.item)}</span>
        <span class="amt">${fmt(i.amount, i.unit ? ` ${escapeHtml(i.unit)}` : "")}</span>
      </li>
      ${i.tips ? `<div class="ing-tip">${escapeHtml(i.tips)}</div>` : ""}`,
    )
    .join("");

  const instructionsList = (recipe.instructions ?? [])
    .map(
      (s, idx) => `
      <li class="step-item">
        <div class="step-num">${s.step ?? idx + 1}</div>
        <div class="step-body">
          ${s.title ? `<div class="step-title">${escapeHtml(s.title)}</div>` : ""}
          ${s.description ? `<div class="step-text">${escapeHtml(s.description)}</div>` : ""}
          ${s.tips ? `<div class="step-tip">Tip: ${escapeHtml(s.tips)}</div>` : ""}
        </div>
      </li>`,
    )
    .join("");

  const hasNutrition =
    recipe.nutrition && Object.values(recipe.nutrition).some((v) => v != null);

  const totalTime =
    recipe.preptime != null && recipe.cooktime != null
      ? fmt(Number(recipe.preptime) + Number(recipe.cooktime), " min")
      : null;

  const content = `
    ${brandMarkup}
    
    <h1 class="title">${escapeHtml(recipe.title ?? "Recipe")}</h1>
    ${recipe.description ? `<p class="subtitle">${escapeHtml(recipe.description)}</p>` : ""}

    <div class="meta-bar">
      ${category ? `<div class="meta-item"><span class="label">Category</span><span class="val">${escapeHtml(category)}</span></div><span class="meta-sep">·</span>` : ""}
      ${totalTime ? `<div class="meta-item"><span class="label">Total</span><span class="val">${totalTime}</span></div><span class="meta-sep">·</span>` : ""}
      ${recipe.preptime ? `<div class="meta-item"><span class="label">Prep</span><span class="val">${fmt(recipe.preptime, " min")}</span></div><span class="meta-sep">·</span>` : ""}
      ${recipe.cooktime ? `<div class="meta-item"><span class="label">Cook</span><span class="val">${fmt(recipe.cooktime, " min")}</span></div><span class="meta-sep">·</span>` : ""}
      ${recipe.servings ? `<div class="meta-item"><span class="label">Servings</span><span class="val">${fmt(recipe.servings)}</span></div><span class="meta-sep">·</span>` : ""}
      <div class="meta-item"><span class="label">Difficulty</span><span class="val">${escapeHtml(recipe.difficulty ?? "Standard")}</span></div>
    </div>

    <div class="recipe-grid">
      <!-- Left Column: Image, Ingredients, Nutrition -->
      <div class="col-side">
        ${recipe.image?.url ? `<img class="recipe-thumb" src="${escapeHtml(recipe.image.url)}" alt="${escapeHtml(recipe.title ?? "Recipe")}" />` : ""}

        <div class="sec-title">
          <span>Ingredients</span>
          <span class="count">${(recipe.ingredients ?? []).length} items</span>
        </div>
        <ul class="ing-list">
          ${ingredientsList || `<li class="ing-item"><span class="name">—</span></li>`}
        </ul>

        ${
          hasNutrition
            ? `
          <div class="nutrition-box">
            <div class="sec-title" style="margin-bottom:6px;border-bottom:none;padding:0;">
              <span>Nutrition Per Serving</span>
            </div>
            <div class="nutrition-grid">
              <div class="nut-stat"><span class="v">${fmt(recipe.nutrition?.calories)}</span><span class="l">kcal</span></div>
              <div class="nut-stat"><span class="v">${fmt(recipe.nutrition?.protein, "g")}</span><span class="l">Protein</span></div>
              <div class="nut-stat"><span class="v">${fmt(recipe.nutrition?.carbs, "g")}</span><span class="l">Carbs</span></div>
              <div class="nut-stat"><span class="v">${fmt(recipe.nutrition?.fat, "g")}</span><span class="l">Fat</span></div>
            </div>
          </div>`
            : ""
        }
      </div>

      <!-- Right Column: Preparation Steps -->
      <div class="col-main">
        <div class="sec-title">
          <span>Preparation & Instructions</span>
          <span class="count">${(recipe.instructions ?? []).length} steps</span>
        </div>
        <ol class="step-list">
          ${instructionsList || `<li class="step-item"><div class="step-num">1</div><div class="step-body"><div class="step-text">See recipe directions online.</div></div></li>`}
        </ol>
      </div>
    </div>

    <div class="doc-footer">
      <span>Authentic Ethiopian recipe crafted on Gurshaland.com</span>
      <span>Nutritional estimates for informational purposes only</span>
    </div>
  `;

  return wrap(content, recipe.title ?? "Recipe");
};

export const buildMealPlanPdfHtml = (plan: PdfMealInput): string => {
  const goalFormatted = plan.goal ? escapeHtml(plan.goal.replace(/_/g, " ")) : null;

  const daysHtml = (plan.days ?? []).map((d, idx) => {
    const mealsHtml = (d.meals ?? []).map((m, mIdx) => {
      const macroParts = [
        m.calories ? `${m.calories} kcal` : null,
        m.protein ? `${m.protein}g P` : null,
        m.carbs ? `${m.carbs}g C` : null,
        m.fat ? `${m.fat}g F` : null,
      ].filter(Boolean);

      return `
        <div class="meal-box">
          <div class="meal-type">${escapeHtml(m.type || `Meal ${mIdx + 1}`)}</div>
          <div class="meal-name">${escapeHtml(m.name ?? "—")}</div>
          ${m.description ? `<div class="meal-desc">${escapeHtml(m.description)}</div>` : ""}
          ${macroParts.length ? `<div class="meal-macros">${macroParts.join(" · ")}</div>` : ""}
        </div>
      `;
    }).join("");

    return `
      <div class="day-card">
        <div class="day-header">
          <div class="day-title-wrap">
            <span class="day-badge">${String(idx + 1).padStart(2, "0")}</span>
            <h3 class="day-title">${escapeHtml(d.day ?? `Day ${idx + 1}`)}</h3>
          </div>
          ${(d.totalCalories ?? d.total_calories) ? `<span class="day-kcal">${fmt(d.totalCalories ?? d.total_calories, " kcal total")}</span>` : ""}
        </div>
        <div class="day-meals">
          ${mealsHtml}
        </div>
      </div>
    `;
  }).join("");

  const shoppingItems = (plan.shopping_list ?? []).map(
    (item) => `<li><span class="chk"></span><span>${escapeHtml(item)}</span></li>`,
  ).join("");

  const tipsItems = (plan.pro_tips ?? []).map(
    (tip) => `<li><span class="guidance-dot"></span><span>${stripMarkdown(tip)}</span></li>`,
  ).join("");

  const content = `
    ${brandMarkup}

    <h1 class="title">${escapeHtml(plan.name ?? "Personalized Meal Plan")}</h1>
    
    <div class="meta-bar">
      ${goalFormatted ? `<div class="meta-item"><span class="label">Goal</span><span class="val">${goalFormatted}</span></div><span class="meta-sep">·</span>` : ""}
      <div class="meta-item"><span class="label">Duration</span><span class="val">${(plan.days ?? []).length} Days</span></div><span class="meta-sep">·</span>
      ${plan.meals_per_day ? `<div class="meta-item"><span class="label">Schedule</span><span class="val">${plan.meals_per_day} meals/day</span></div><span class="meta-sep">·</span>` : ""}
      ${plan.calories ? `<div class="meta-item"><span class="label">Target</span><span class="val">${plan.calories} kcal/day</span></div>` : ""}
    </div>

    ${plan.notes ? `<div class="meal-plan-intro">&ldquo;${escapeHtml(plan.notes)}&rdquo;</div>` : ""}

    <div class="sec-title" style="margin-bottom: 12px;">
      <span>Daily Meal Itinerary</span>
      <span class="count">${(plan.days ?? []).length} Days Planned</span>
    </div>

    ${daysHtml}

    ${
      shoppingItems || tipsItems
        ? `
      <div class="two-col-bottom">
        ${
          shoppingItems
            ? `
          <div class="two-col-item">
            <div class="sec-title" style="margin-bottom: 8px;">
              <span>Grocery &amp; Pantry Checklist</span>
              <span class="count">${(plan.shopping_list ?? []).length} items</span>
            </div>
            <ul class="checklist">${shoppingItems}</ul>
          </div>`
            : ""
        }
        ${
          tipsItems
            ? `
          <div class="two-col-item">
            <div class="sec-title" style="margin-bottom: 8px;">
              <span>Chef's Preparation Notes</span>
              <span class="count">Tips</span>
            </div>
            <ul class="guidance-list">${tipsItems}</ul>
          </div>`
            : ""
        }
      </div>`
        : ""
    }

    <div class="doc-footer">
      <span>Gurshaland Meal Planner · Tailored Ethiopian Nutrition</span>
      <span>Consult a physician or licensed dietitian for specific health conditions</span>
    </div>
  `;

  return wrap(content, plan.name ?? "Meal Plan");
};
