import { deleteComment, postComment } from '@/actions/Recipe/comment';
import { getRecipebySlug } from '@/actions/Recipe/recipe';
import Recipe, { RecipeComment } from '@/utils/types/recipe';
import { create } from 'zustand';


interface RecipeDetailStore {
    recipe: Recipe | null;
    loading: boolean;
    error: string | null;
    fetchRecipe: (slug: string) => Promise<void>;
    addComment: (comment: RecipeComment) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
}

export const useRecipeDetailStore = create<RecipeDetailStore>((set, get) => ({
    recipe: null,
    loading: false,
    error: null,

    fetchRecipe: async (slug) => {
        set({ loading: true, error: null });
        try {
            const data = await getRecipebySlug(slug)
            set({ recipe: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addComment: async (comment) => {
        try {
            const newComment = await postComment(comment)
            set((state) => ({
                recipe: state.recipe
                    ? { ...state.recipe, comments: [...state.recipe.comments, newComment] }
                    : state.recipe,

            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },
    deleteComment: async (commentId: string) => set((state) => ({
                recipe: state.recipe
                    ? {
                            ...state.recipe,
                            comments: state.recipe.comments.filter((c) => c.id !== commentId),
                        }
                    : state.recipe,
    }))
}))