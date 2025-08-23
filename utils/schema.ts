import z, { string } from "zod";

export const ingredientSchema = z.object({
  item: z.string().min(1, "Required"),
  amount: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

const imageSchema = z.object({
  path: z.string(),
  url: z.string(),
});

export const recipeImageSchema = imageSchema.extend({
  recipe_id: z.string(),
});

export const instructionImageSchema = imageSchema.extend({
  instruction_id: z.string(),
});

export const RecipeRatingSchema = z.object({
  recipe_id: z.string(),
  user_id: z.string(),
  rating: z.number().min(0).max(5).optional(),
})

export const instructionSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  time: z.string().optional(),
  tips: z.string().optional(),
  step: z.number().nonnegative().min(1),
  image: instructionImageSchema.optional(),
});

export const nutritionSchema = z.object({
  calories: z.preprocess((val) => Number(val), z.number()),
  protein: z.preprocess((val) => Number(val), z.number()),
  carbs: z.preprocess((val)=> Number(val), z.number()), 
  fat:  z.preprocess((val) => Number(val), z.number()),
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
    prepTime: z.preprocess((val)=> Number(val), z.number().min(0)),
    cookTime: z.preprocess((val) => Number(val),z.number().min(0)),
    servings:  z.number().min(1),
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
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must contain only letters and numbers" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
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
    file: z.any().refine((file) => file instanceof File || file == null, {message:"Invalid file"}).nullable().optional(),
    path: z.string().optional(),
    url:  z.string().optional(),
  })


const IngredientSchema = z.array(
            z.object({
              amount: z.string().default(0),
              name: z.string().min(1, "Ingredient name is required"),
            }),
          )
          .optional()


const TipsSchema = z.object({
  title: z.string(),
  items: z.array(z.string()).optional()
})

const ContentIngredient = z.object({
  amount: z.number(),
  measurement: z.string(),
  name: z.string()
})

const RecipeSchema =  z.object({
          title: z.string(),
          ingredients: ContentIngredient,
          instructions: z.array(z.string())
        })

export const ContentSchema = z
    .array(
      z.object({
        image: ImageSchema,
        body: z.string().min(1, "Content is required"),
        title: z.string(),
        tips: TipsSchema.optional(),
        ingredients: z.array(ContentIngredient).optional(),
        recipe: RecipeSchema.optional()
      }),
    )
    .optional()

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  image: ImageSchema,
  content: ContentSchema, 
});




// dashboard settings

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(1, "New password is required"),
  confirm_password: z.string().min(1, "Confirm password is required"),
});