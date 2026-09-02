export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  recipe_count?: number | null;
}
