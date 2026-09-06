import { ImageSchema } from "@/utils/schema";
import { z } from "zod";

const ReviewSchema = z.object({
  id: z.string().optional(),
  author_id: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  comment: z.string().max(1000).optional().or(z.literal("")),
  name: z.string().max(100).optional().or(z.literal("")),
  created_at: z.string().optional(),
});

const MenuPriceSchema = z.object({
  amount: z.coerce.number().min(0).max(10000000).default(0),
  currency: z.string().max(10).optional().default("ETB"),
});

const MenuSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Menu item name is required").max(150),
  description: z.string().max(1000).optional().or(z.literal("")),
  price: MenuPriceSchema.optional(),
});

const getMenuSchema = MenuSchema.extend({
  id: z.string().optional(),
});

const RestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").max(150),
  description: z.string().max(2500).optional().or(z.literal("")),
  cuisines: z.array(z.string()),
  address: z.string().max(300).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  email: z
    .string()
    .max(120)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Please provide a valid email address" }
    ),
  website: z.string().max(500).optional().or(z.literal("")),
  image: ImageSchema.optional(),
  google_map_url: z.string().max(1000).optional().or(z.literal("")),
  menu: z.array(MenuSchema).optional(),
  author_id: z.string().optional(),
  gallery: z.array(ImageSchema).optional(),
  reviews: z.array(ReviewSchema).optional(),
  city: z.string().max(100).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
});

export const getRestaurentSchema = RestaurantSchema.extend({
  id: z.union([z.string(), z.number()]),
  rating: z.coerce.number().min(0).max(5).optional(),
  slug: z.string().optional(),
  author: z
    .object({
      id: z.string().optional(),
      name: z.string().max(100).optional().or(z.literal("")),
      email: z.string().max(100).optional().or(z.literal("")),
      image: z.string().max(500).optional().or(z.literal("")),
    })
    .optional(),
  menu: z.array(getMenuSchema).optional(),
  image: ImageSchema.extend({
    id: z.union([z.string(), z.number()]).optional(),
  }).optional(),
});

export const fetchRestaurantSchema = RestaurantSchema.extend({
  id: z.union([z.string(), z.number()]).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  slug: z.string().optional(),
});

export type RestaurantFormType = z.infer<typeof RestaurantSchema>;
export type GetRestaurentType = z.infer<typeof getRestaurentSchema>;
export type FetchRestaurantType = z.infer<typeof fetchRestaurantSchema>;

export default RestaurantSchema;
