import z from "zod";

export const ingredientSchema = z.object({
  item: z.string().min(1, "Required"),
  amount: z.string().min(1, "Required"),
  notes: z.string().optional(),
});
export const instructionSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  time: z.string().optional(),
  tips: z.string().optional(),
});
export const formSchema = z.object({
  title: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1),
  instructions: z.array(instructionSchema).min(1),
  tags: z.array(z.string()),
  culturalNote: z.string().optional(),
  image: z.any().optional(),
  status: z.enum(["draft", "published"]),
});

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(2, { message: "Password must be at least 8 characters" }),
});

export const signupFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }).max(12, { message: "Username must be at most 12 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  full_name: z.string().min(1, { message: "Full name is required" })
});


export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirm_password: z.string().min(8, { message: "Password must be at least 8 characters" })
})


