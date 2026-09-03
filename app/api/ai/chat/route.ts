import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { tavilySearch } from "@tavily/ai-sdk";
import { chat_personality } from "@/ai/prompt";
import { query } from "@/ai/chunking";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { ChatNavigationAction } from "@/lib/chat-actions";
import type { MealPlanPrefill } from "@/lib/chat-actions";

const MEAL_PLAN_VALUES = z.object({
  timeframe: z.enum(["today", "full-week"]),
  goal: z.enum(["fat_loss", "muscle_gain", "maintenance"]),
  diet: z.enum(["standard", "vegetarian", "vegan", "keto"]),
  meals_per_day: z.number().int().min(2).max(6),
  calories: z.number().optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  height: z.object({ value: z.number(), unit: z.string() }).optional(),
  weight: z.object({ value: z.number(), unit: z.enum(["kg", "lb"]) }).optional(),
  activity_level: z
    .enum([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ])
    .optional(),
  prompt: z.string().optional(),
});

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

/**
 * Fills in safe defaults for anything the model/user didn't specify, and
 * personalizes the request with the logged-in user's known profile info.
 * Never invents anthropometric data  those are only kept when the user
 * actually told us them.
 */
function normalizeMealPlanValues(
  values: Partial<MealPlanPrefill>,
  profile: unknown,
): MealPlanPrefill {
  const person =
    (profile as any)?.full_name || (profile as any)?.username || null;
  const prompt = [
    values.prompt ? values.prompt.trim() : null,
    person ? `Personalize the plan for ${person}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    timeframe: values.timeframe ?? "today",
    goal: values.goal ?? "maintenance",
    diet: values.diet ?? "standard",
    meals_per_day: values.meals_per_day ?? 3,
    ...(values.calories !== undefined ? { calories: values.calories } : {}),
    ...(values.age !== undefined ? { age: values.age } : {}),
    ...(values.gender !== undefined ? { gender: values.gender } : {}),
    ...(values.height !== undefined ? { height: values.height } : {}),
    ...(values.weight !== undefined ? { weight: values.weight } : {}),
    activity_level: values.activity_level ?? "moderately_active",
    ...(prompt ? { prompt } : {}),
  };
}

async function loadUserContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, credits: null };

  let profile: unknown = null;
  try {
    const { data } = await supabase.rpc("get_setting_profile", {
      _profile_id: user.id,
    });
    profile = data;
  } catch {
    profile = null;
  }

  let credits: number | null = null;
  try {
    const { data } = await supabase.rpc("get_credits");
    credits = typeof data === "number" ? data : null;
  } catch {
    credits = null;
  }

  return { user, profile, credits };
}

async function searchRestaurantsDB(
  supabase: Awaited<ReturnType<typeof createClient>>,
  queryText: string,
  limit: number,
) {
  const admin = getAdminClient();
  try {
    const client = admin ?? supabase;
    const { data, error } = await client.rpc("search_restaurants", {
      _query: queryText,
      _limit: limit,
    });
    if (!error && Array.isArray(data)) return data;
  } catch {
    // fall through to ilike
  }

  const safe = queryText.replace(/%/g, "\\%").replace(/_/g, "\\_");
  const { data, error } = await supabase
    .from("restaurant")
    .select(
      "id, name, slug, description, address, city, country, rating, image, cuisines, google_map_url, website",
    )
    .or(
      `name.ilike.%${safe}%,description.ilike.%${safe}%,address.ilike.%${safe}%,city.ilike.%${safe}%`,
    )
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

async function searchRecipesDB(
  supabase: Awaited<ReturnType<typeof createClient>>,
  queryText: string,
  limit: number,
) {
  const admin = getAdminClient();
  try {
    const client = admin ?? supabase;
    const { data, error } = await client.rpc("search_recipes", {
      _query: queryText,
      _limit: limit,
    });
    if (!error && Array.isArray(data)) return data;
  } catch {
    // fall through to ilike
  }

  const safe = queryText.replace(/%/g, "\\%").replace(/_/g, "\\_");
  const { data, error } = await supabase
    .from("recipe")
    .select(
      "id, title, slug, description, difficulty, servings, tags, preptime, cooktime",
    )
    .eq("status", "published")
    .or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

function buildSystemPrompt(ctx: {
  userContext: string;
  knowledge: string;
}) {
  return `${chat_personality}

# Who you are talking to
${ctx.userContext}

# Retrieved knowledge base context
${ctx.knowledge}

# What you can do on Gurshaland
You are the Gurshaland AI assistant embedded in the chat widget. You can do all of the following:

1. ANSWER COOKING QUESTIONS
   Use the retrieved knowledge above plus your Ethiopian-cuisine expertise. If the retrieved context is empty, rely on your own knowledge and be honest that you're answering from general knowledge.

2. SEARCH THE SITE'S DATABASE with tools
   - searchRestaurants(query, limit): find real restaurants from OUR directory by name, area, cuisine, or a dish they serve (e.g. "shiro", "kitfo", "injera", "pizza"). ALWAYS call this before claiming anything about a restaurant. Quote the name, rating, and area; mention which menu dishes matched. If no results, say so.
   - searchRecipes(query, limit): find real published recipes ON THE SITE by dish, ingredient, or tag. ALWAYS call this before claiming an existing recipe. If the user wants a brand-new custom recipe, use navigateToRecipeGenerator instead.
   - getMyProfile: returns the logged-in user's profile and credit balance. Use for questions like "how many credits do I have?" or "what's my username?".
   - tavilySearch: current general web knowledge (e.g. a dish not in our database).

3. NAVIGATE THE USER WITH PRE-FILLED INPUTS (the app will open the page and pre-fill a form, then auto-run it)
   - navigateToRecipeGenerator(prompt): call when the user wants to GENERATE a new recipe. Write prompt as a clean, well-formatted request: what they want to cook, ingredients they have, dietary needs, servings, difficulty, and any time limits. Do not put markdown in the prompt.
   - navigateToMealPlanner(values): call when the user wants a meal plan. Fill values from what they said: timeframe ("today" or "full-week"), goal, diet, meals_per_day (2-6), and optional calories/age/gender/height/weight/activity_level/prompt. Never invent age, gender, height, or weight  leave those out unless the user mentioned them. Anything missing gets a sensible default automatically, and the plan is personalized with the logged-in user's name.

# Rules
- ALWAYS call a tool before asserting facts about restaurants, existing recipes, or the user's account. Never invent restaurants, ratings, dishes, or recipes.
- When the user asks to "generate", "make me", or "create" a recipe → navigateToRecipeGenerator. When they ask about an existing recipe or a dish → searchRecipes (or answer directly) and offer the generator as a next step.
- When the user asks where to eat or to find a restaurant → searchRestaurants and summarize the best matches with the matched dishes.
- Be concise and warm: 2-5 short sentences unless the user asks for detail. Use short bullet lists when a list is clearer.
- Never combine dish names (e.g. "Doro Shiro Wat" is not a real dish).
- After calling a navigation tool, tell the user in one line what you're opening and what you pre-filled.`;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { user, profile, credits } = await loadUserContext(supabase);

  if (!user) {
    return NextResponse.json(
      { error: "Please log in to use AI features." },
      { status: 401 },
    );
  }

  const { messages }: { messages: any[] } = await req.json();

  const userquery =
    (messages[messages.length - 1]?.parts?.find(
      (p: any) => p.type === "text",
    )?.text as string) ?? "";

  let knowledgeText = "";
  try {
    const knowledge = await query(userquery);
    if (Array.isArray(knowledge) && knowledge.length > 0) {
      knowledgeText = knowledge
        .map((k: any) => `- ${k.text ?? ""}`)
        .filter(Boolean)
        .join("\n");
    }
  } catch (e) {
    console.warn("RAG knowledge query failed:", e);
  }
  if (!knowledgeText) {
    knowledgeText = "(no knowledge base entries matched this query)";
  }

  const displayName =
    (profile as any)?.full_name ||
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    null;
  const username =
    (profile as any)?.username || (user.user_metadata?.username as string) || null;

  const userContextLines = [
    `User id: ${user.id}`,
    displayName ? `Name: ${displayName}` : null,
    username ? `Username: @${username}` : null,
    `Email: ${user.email ?? "unknown"}`,
    credits !== null ? `Credit balance: ${credits} credits` : null,
  ].filter(Boolean);

  const userContext = userContextLines.join("\n");

  try {
    const stream = await streamText({
      model: google("gemini-2.5-flash"),
      system: buildSystemPrompt({ userContext, knowledge: knowledgeText }),
      messages: convertToModelMessages(messages),
      tools: {
        tavilySearch: tavilySearch({
          searchDepth: "advanced",
          maxResults: 5,
          includeAnswer: true,
        }),
        searchRestaurants: tool({
          description:
            "Search the Gurshaland restaurant directory by name, area, cuisine, or a dish they serve (e.g. 'shiro', 'kitfo', 'injera', 'pizza'). Returns real restaurants with name, rating, area, and matched menu dishes.",
          inputSchema: z.object({
            query: z
              .string()
              .describe("What the user wants to find, e.g. 'shiro', 'kitfo', 'pizza', 'Bole'"),
            limit: z.number().int().min(1).max(10).default(5),
          }),
          execute: async ({ query: q, limit }) => ({
            results: await searchRestaurantsDB(supabase, q, limit),
          }),
        }),
        searchRecipes: tool({
          description:
            "Search the Gurshaland recipe database for published recipes by dish name, ingredient, or tag (e.g. 'doro wat', 'shiro', 'lentil'). Returns real recipes with title, slug, rating, difficulty, and matched ingredients.",
          inputSchema: z.object({
            query: z.string().describe("The dish, ingredient, or tag to look for"),
            limit: z.number().int().min(1).max(10).default(5),
          }),
          execute: async ({ query: q, limit }) => ({
            results: await searchRecipesDB(supabase, q, limit),
          }),
        }),
        getMyProfile: tool({
          description:
            "Returns the logged-in user's profile (username, full name, bio, avatar) and current credit balance. Use when the user asks about their own account, profile, or credits.",
          inputSchema: z.object({}),
          execute: async () => ({
            profile,
            credits,
          }),
        }),
        navigateToRecipeGenerator: tool({
          description:
            "Navigate the user to the AI Recipe Generator page and pre-fill their request, then auto-run generation. Call when the user wants to generate a NEW recipe (e.g. 'generate a shiro recipe', 'make me dinner').",
          inputSchema: z.object({
            prompt: z
              .string()
              .describe(
                "A clean, well-formatted cooking request: the dish, ingredients on hand, dietary preferences, servings, difficulty, and time limits. Plain text, no markdown.",
              ),
          }),
          execute: async ({ prompt }): Promise<ChatNavigationAction> => ({
            action: "navigate-recipe-generator",
            prompt,
          }),
        }),
        navigateToMealPlanner: tool({
          description:
            "Navigate the user to the Meal Planner page, pre-fill their preferences, and auto-run generation. Call when the user wants a meal plan. Fill every field the user mentioned; leave optional body fields (age, gender, height, weight) OUT unless the user told you them  never invent them. The app applies sensible defaults for anything missing and personalizes with the logged-in user's name.",
          inputSchema: z.object({
            values: MEAL_PLAN_VALUES,
          }),
          execute: async ({
            values,
          }): Promise<ChatNavigationAction> => ({
            action: "navigate-meal-planner",
            values: normalizeMealPlanValues(values ?? {}, profile),
          }),
        }),
      },
      stopWhen: stepCountIs(5),
    });

    return stream.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "try again" }, { status: 500 });
  }
}
