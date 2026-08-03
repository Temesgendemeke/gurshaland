import { ImageSchema } from "@/utils/schema";
import { z } from "zod";

const ReviewSchema = z.object({
  id: z.string().uuid(),
  author_id: z.string().uuid(),
  rating: z.number().min(0).max(5),
  comment: z.string().min(10).max(500),
  name: z.string().min(2).max(100),
  created_at: z.string().datetime(),
});

const MenuPriceSchema = z.object({
  amount: z.number().min(0).max(1000),
  currency: z.string().min(3).max(3),
})

const MenuSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  price: MenuPriceSchema,
});

const getMenuSchema = MenuSchema.extend({
  id: z.string(),
});



const RestaurantSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  cuisines: z.array(z.string().min(2).max(100)),
  address: z.string().min(5).max(200),
  phone: z.string().min(10).max(20),
  email: z.string().email().min(5).max(100),
  website: z.union([z.string().url(), z.literal("")]).optional(),
  image: ImageSchema.optional(),
  google_map_url: z.union([z.string().url(), z.literal("")]).optional(),
  menu: z.array(MenuSchema).optional(),
  author_id: z.string().uuid().optional(),
  gallery: z.array(ImageSchema).optional(),
  reviews: z.array(ReviewSchema).optional(),
  city: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100).optional(),
});

export const getRestaurentSchema = RestaurantSchema.extend({
  id: z.string(),
  rating: z.number().min(0).max(5).optional(),
  slug: z.string(),
  author: z
    .object({
      id: z.string().uuid(),
      name: z.string().min(2).max(100),
      email: z.string().email().min(5).max(100),
      image: z.string().url().min(5).max(200).optional(),
    })
    .optional(),
  menu: z.array(getMenuSchema).optional(),
  image: ImageSchema.extend({
    id: z.string(),
  }).optional(),
});


export const fetchRestaurantSchema = RestaurantSchema.extend({
    rating: z.number().min(0).max(5).optional(),
    slug: z.string()
})

export type RestaurantFormType = z.infer<typeof RestaurantSchema>;
export type GetRestaurentType = z.infer<typeof getRestaurentSchema>;
export type FetchRestaurantType = z.infer<typeof fetchRestaurantSchema>;

export default RestaurantSchema;
