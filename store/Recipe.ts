import Recipe, { RecipeComment } from "@/utils/types/recipe";
import { create } from "zustand";
import { getRecipes } from "@/actions/Recipe/recipe";
import { deleteComment } from "@/actions/Recipe/comment";

interface RecipeStore {
  recipes: Recipe[] | null;
  loading: Boolean;
  setRecipe: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipe_id: string) => void;
  fetchRecipes: () => void;
  addComment: (comment: RecipeComment) => void;
  removeComment: (recipe_id: string, comment_id: string) => void;
}

export const recipeStore = create<RecipeStore>((set, get) => ({
  recipes: null,
  loading: false,
  fetchRecipes: async () => {
    set({ loading: true });
    try {
      const recipes = await getRecipes();
      set({ recipes, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
  setRecipe: (recipes) => set({ recipes }),
  addRecipe: (recipe) =>
    set((state) => ({
      recipes: state.recipes ? [...state.recipes, recipe] : [recipe],
    })),
  removeRecipe: (recipe_id) =>
    set((state) => ({
      recipes: state.recipes
        ? state.recipes.filter((r) => r.id !== recipe_id)
        : null,
    })),

  addComment: async (comment) => {
    set((state) => ({
      recipes: state.recipes?.map((recipe) =>
        recipe.id === comment.recipe_id
          ? { ...recipe, comments: [...recipe.comments, comment] }
          : recipe
      ),
    }));
  },

  removeComment: async (recipe_id, comment_id) => {
    set((state) => ({
      recipes: state.recipes
        ? state.recipes.map((recipe) =>
            recipe.id === recipe_id
              ? {
                  ...recipe,
                  comments: recipe.comments.filter(
                    (comment) => comment.id !== comment_id
                  ),
                }
              : recipe
          )
        : null,
    }));
    await deleteComment(comment_id);
  },
}));
