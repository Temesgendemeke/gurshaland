import z, { string } from "zod";

export const ingredientSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  item: z.string().min(1, "Required"),
  amount: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = typeof val === "string" ? Number(val) : val;
    return Number.isFinite(num) ? num : undefined;
  }, z.number().nonnegative().optional()),
  unit: z.string().nullish(),
  notes: z.string().nullish(),
});

export const imageSchema = z.object({
  path: z.string().nullish(),
  url: z.string().nullish(),
});

export const recipeImageSchema = z.object({
  path: z.string().nullish(),
  url: z.string().nullish(),
  recipe_id: z.union([z.number(), z.string()]).nullish(),
  id: z.union([z.number(), z.string()]).nullish(),
});

export const instructionImageSchema = z.object({
  path: z.string().nullish(),
  url: z.string().nullish(),
  instruction_id: z.union([z.number(), z.string()]).nullish(),
  id: z.union([z.number(), z.string()]).nullish(),
  file: z.any().optional(),
  step: z.number().optional(),
});

export const RecipeRatingSchema = z.object({
  recipe_id: z.number(),
  user_id: z.string(),
  rating: z.number().min(0).max(5).optional(),
});

export const instructionSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  description: z.string().min(1, "Required"),
  time: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = typeof val === "string" ? Number(val) : val;
    return Number.isFinite(num) ? num : undefined;
  }, z.number().nonnegative().optional()),
  tips: z.string().optional(),
  step: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().nonnegative().min(1),
  ),
  image: instructionImageSchema.optional(),
  id: z.number().optional(),
  recipe_id: z.number().optional(),
});

export const nutritionSchema = z.object({
  calories: z.preprocess((val) => Number(val), z.number()),
  protein: z.preprocess((val) => Number(val), z.number()),
  carbs: z.preprocess((val) => Number(val), z.number()),
  fat: z.preprocess((val) => Number(val), z.number()),
  fiber: z.preprocess((val) => Number(val), z.number()),
});

// category schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const formSchema = z.object({
  recipe: z.object({
    title: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    prepTime: z.preprocess((val) => Number(val), z.number().min(0)),
    cookTime: z.preprocess((val) => Number(val), z.number().min(0)),
    servings: z.preprocess((val) => Number(val), z.number().min(1)),
    difficulty: z.string().optional(),
    tags: z.array(z.string()),
    culturalNote: z.string().optional(),
    image: recipeImageSchema.optional(),
    status: z.enum(["draft", "published"]),
    author_id: z.string(),
    slug: z.string(),
  }),
  category: categorySchema.optional(),
  ingredients: z.array(ingredientSchema).min(1),
  instructions: z.array(instructionSchema).min(1),
  nutrition: nutritionSchema,
});

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 8 characters" }),
});

export const signupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(12, { message: "Username must be at most 12 characters" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username must contain only letters and numbers",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirm_password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const ImageSchema = z.object({
  file: z
    .any()
    .refine(
      (file) =>
        (typeof File !== "undefined" && file instanceof File) || file == null,
      {
        message: "Invalid file",
      },
    )
    .nullable()
    .optional(),
  path: z.string().nullish(),
  url: z.string().nullish(),
  id: z.union([z.number(), z.string()]).nullish(),
  content_id: z.union([z.number(), z.string()]).nullish(),
  blog_id: z.union([z.number(), z.string()]).nullish(),
});

const IngredientSchema = z
  .array(
    z.object({
      amount: z.string().default("0"),
      name: z.string().min(1, "Ingredient name is required"),
    }),
  )
  .optional();

const TipsSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  items: z.array(z.string()).nullish(),
});

const ContentIngredient = z.object({
  amount: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = typeof val === "string" ? Number(val) : val;
    return Number.isFinite(num) ? num : undefined;
  }, z.number().optional()),
  measurement: z.string().nullish(),
  name: z.string().nullish(),
  id: z.union([z.number(), z.string()]).nullish(),
});

const RecipeSchema = z.object({
  title: z.string().nullish(),
  ingredients: z.array(ContentIngredient).nullish(),
  instructions: z.array(z.string()).nullish(),
});

export const ContentSchema = z
  .array(
    z.object({
      id: z.union([z.number(), z.string()]).nullish(),
      image: ImageSchema.nullish(),
      body: z.string().nullish().or(z.literal("")),
      title: z.string().nullish(),
      tips: TipsSchema.nullish(),
      recipe: RecipeSchema.nullish(),
      instructions: z.array(z.string()).nullish(),
      items: z.array(z.string()).nullish(),
      ingredients: z.array(z.any()).nullish(),
    }),
  )
  .optional();

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().nullable(),
  status: z.enum(["draft", "published"]),
  image: ImageSchema.nullish(),
  contents: ContentSchema,
});

// dashboard settings

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
