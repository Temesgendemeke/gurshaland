export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface Nutrition {
  protein:  number;
  carbs:  number;
  fat:  number;
  fiber:  number;
  calories:  number;
}

export interface Instruction {
  step: number;
  title: string;
  description: string;
  time?: string;
  tips?: string;
  image?: InstructionImage;
}

interface Image {
  path: string;
  url: string;
}

export interface RecipeImage extends Image {
  recipe_id: string;
}

export interface InstructionImage extends Image {
  instruction_id: string;
}

export default interface Recipe {
  id?: string;
  title: string;
  category: string;
  description: string;
  preptime: number;
  cooktime: number
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Nutrition;
  tags: string[];
  culturalNote: string;
  image: RecipeImage;
  status: "draft" | "published";
  author_id: string;
  slug: string;
  author?: author;
  time: string;
  reviews: number;
  rating: Rating[];
  likes: RecipeLike[] | [];
  comments: RecipeComment[];
  average_rating: number;
  bookmarks?: RecipeBookmark[]
}

export interface Profile{
  avatar_url: string,
  id: string,
  username: string,
  full_name: string,
  bio?: string,
}

export interface RecipeComment {
  id?: string;
  recipe_id: string;
  comment: string;
  author_id: string;
  rating?: number;
  created_at?: string;
  author?: Profile;
  // likes: Like[];
}

interface author {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  recipes: number;
}

interface Like {
  liked_by: string;
}

export interface RecipeLike extends Like {
  recipe_id: string;
}

interface BlogLike extends Like {
  blog_id: string;
}


export interface Rating{
  user_id: string,
  recipe_id: string,
  rating: number
}


export interface PostComment extends RecipeComment {
  id: string;
  author: Profile;
  rating: number;
}


export interface RecipeBookmark{
  user_id: string;
  recipe_id: string;
}