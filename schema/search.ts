import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().min(2).max(100),
  location: z.string().min(2).max(100).optional(),
  rating: z.number().min(1).max(5).optional(),
});
