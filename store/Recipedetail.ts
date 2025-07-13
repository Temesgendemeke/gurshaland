import { deleteComment as apiDeleteComment, postComment } from '@/actions/Recipe/comment';
import { postOrDeleteLike } from '@/actions/Recipe/like';
import { getRecipebySlug } from '@/actions/Recipe/recipe';
import Recipe, { RecipeBookmark, RecipeComment, RecipeLike } from '@/utils/types/recipe';
import { create } from 'zustand';
import { toggleBookmark as apiToggleBookmark } from '@/actions/Recipe/bookmark';

interface RecipeDetailStore {
    recipe: Recipe | null;
    loading: boolean;
    error: string | null;
    isLiked: boolean | null;
    isBookmarked: boolean | null
    fetchRecipe: (slug: string) => Promise<void>;
    addComment: (comment: RecipeComment) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    toggleLike: (liked_by: string, recipe_id: string) => Promise<void>;
    setIsLiked: (user_id: string)=> void;
    toggleBookmark: (user_id: string, recipe_id: string) => Promise<void>;
    setBookmarked: (user_id: string) => void
}

export const useRecipeDetailStore = create<RecipeDetailStore>((set, get) => ({
    recipe: null,
    loading: false,
    error: null,
    isLiked: false,
    isBookmarked: false,

    fetchRecipe: async (slug: string) => {
        set({ loading: true, error: null });
        try {
            const data: Recipe = await getRecipebySlug(slug);
            set({ recipe: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addComment: async (comment: RecipeComment) => {
        try {
            const newComment = await postComment(comment);
            set((state) => ({
                recipe: state.recipe
                    ? { ...state.recipe, comments: [...state.recipe.comments, newComment] }
                    : state.recipe,
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteComment: async (commentId: string) => {
        try {
            await apiDeleteComment(commentId);
            set((state) => ({
                recipe: state.recipe
                    ? {
                        ...state.recipe,
                        comments: state.recipe.comments.filter((c) => c.id !== commentId),
                    }
                    : state.recipe,
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    toggleLike: async (user_id: string, recipe_id: string) => {
        try {
             await postOrDeleteLike(user_id, recipe_id)
             let liked;
             set((state) => {
            if (!state.recipe) return { recipe: state.recipe };
            const alreadyLiked = state.recipe.likes.some((like) => like.liked_by === user_id);
            let newLikes: RecipeLike[];
            if (alreadyLiked) {
                liked = false
                newLikes = state.recipe.likes.filter((like) => like.liked_by !== user_id);
            } else {
                liked = true
                newLikes = [
                    ...state.recipe.likes,
                    { liked_by: user_id, recipe_id } as RecipeLike,
                ];
            }
            return {
                recipe: { ...state.recipe, likes: newLikes },
                isLiked: liked
            };
        });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "An error occurred." });
        }
    },
    setIsLiked: (user_id) => set((state) => ({isLiked: state.recipe?.likes.some(l => l.liked_by === user_id)})),
    toggleBookmark: async(user_id, recipe_id)=> {
        try{
            // api call
            await apiToggleBookmark(user_id, recipe_id)
            // local 
            let bookmarked;
            set((state)=>{
                 const alreadyBookmarked = state.recipe?.bookmarks?.some(bookmark => bookmark.user_id === user_id)
                 let newBookmarks: RecipeBookmark[];
                 if(alreadyBookmarked){
                    bookmarked = false;
                    newBookmarks = state.recipe?.bookmarks?.filter(b => b.user_id !== user_id) || []
                 }else{
                    bookmarked = true
                    newBookmarks = [...(state.recipe?.bookmarks ?? []), {user_id, recipe_id} as RecipeBookmark]
                 }

                return {
                    recipe: state.recipe ? { ...state.recipe, bookmarks: newBookmarks } : null,
                    isBookmarked: bookmarked
                }
            })
        }
        catch(error){
            set({error: error instanceof Error ? error.message : "An error occurred."})
        }
    },
    setBookmarked: (user_id)=> set((state)=>({isBookmarked: state.recipe?.bookmarks ?  state.recipe.bookmarks.some(bookmark => bookmark.user_id === user_id) : false}))
}));