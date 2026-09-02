import { getCategories } from "@/actions/Recipe/category";
import { Category } from "@/utils/types/category";
import { create } from "zustand";

interface CategoryStore {
  categories: Category[] | null;
  loading: boolean;
  error: string | null;
  setCategories: (categories: Category[]) => void;
  fetchCategories: () => Promise<void>;
}

export const categoryStore = create<CategoryStore>((set) => ({
  categories: null,
  loading: true,
  error: null,

  setCategories: (categories: Category[]) => set({ categories }),

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await getCategories();
      set({ categories: data ?? [], error: null });
    } catch (error) {
      set({
        error:
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "An error occurred.",
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export const slugifyCategory = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-");
