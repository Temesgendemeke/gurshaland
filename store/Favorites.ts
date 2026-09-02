import Recipe from "@/utils/types/recipe";
import { create } from "zustand";
import { getBookmarkedRecipes } from "@/actions/Recipe/bookmark";

interface FavoritesStore {
  recipes: Recipe[];
  loading: boolean;
  fetched: boolean;
  fetchBookmarks: (user_id: string) => void;
  removeBookmark: (recipe_id: string) => void;
}

export const favoritesStore = create<FavoritesStore>((set, get) => ({
  recipes: [],
  loading: false,
  fetched: false,
  fetchBookmarks: async (user_id: string) => {
    if (get().fetched) return;
    set({ loading: true });
    try {
      const recipes = await getBookmarkedRecipes(user_id);
      set({ recipes, loading: false, fetched: true });
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      set({ loading: false, fetched: true });
    }
  },
  removeBookmark: (recipe_id: string) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== recipe_id),
    })),
}));
