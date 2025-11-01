import { Description } from "@radix-ui/react-alert-dialog";
import { z } from "zod";

export const step1Schema = z.object({
  id: z.number(),
  title: z.string().min(2).max(100),
  description: z.string().min(2),
  preptime: z.number(),
  servings: z.number(),
  difficulty: z.string(),
  tags: z.array(z.string()),
  culturalNote: z.string().optional(),
  status: z.string().default("draft"),
  author_id: z.string().uuid(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  youtubeVideoLink: z.string().url().optional(),
});

//  ingredient step
export const step2Schema = z.object({
  item: z.string().min(2).max(100),
  amount: z.number().default(0),
  unit: z.string(),
  notes: z.string().optional(),
});

// instructions
export const step3Schema = z.object({
  step: z.number().min(1).max(100),
  title: z.string(),
  description: z.string(),
  time: z.number().optional(),
  tips: z.string().optional(),
});

// nutrition
export const step4Schema = z.object({
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  fiber: z.number(),
  calories: z.number(),
});

export const CombinedCheckoutSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);
export type CombinedCheckoutType = z.infer<typeof CombinedCheckoutSchema>;

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;
export type Step4 = z.infer<typeof step4Schema>;

export type stepsDataForm = Step1 | Step2 | Step3 | Step4;
