import { deleteRecipe, getRecipeByAuthor, getRecipebySlug } from "@/actions/Recipe/recipe";
import generate_error from "@/utils/generate_error";
import { Post } from "@/utils/types/Dashboard";
import Recipe from "@/utils/types/recipe";
import { create } from "zustand";


interface RecipeStore{
     recipes: Post[];
     loading: Boolean;
     error: string | null;
     fetchRecipes: (profile_id: string)=> void;
     deleteRecipe: (reicpe_id: string) => void;
}


const useRecipe = create<RecipeStore>((set)=>({
    recipes: [],
    loading: true,
    error: null,

    fetchRecipes: async(profile_id)=>{
        try {
            set({loading: true})
            const data: Post[] = await getRecipeByAuthor(profile_id)
            set({recipes: data, loading: false})
        } catch (error) {
            set({error: generate_error(error), loading: false})
        }
    },

    deleteRecipe: async(slug)=> {
        try {
            if(slug){
                set({loading: true})
                await deleteRecipe(slug)
                set((state) => ({loading: false, recipes: state.recipes.filter((recipe) => recipe.slug !== slug)}))
            }else{
                set({ error: "No recipe id provided for deletion." })
            }
        } catch (error) {
            set({error: generate_error(error)})
        }
    }
}))

export default useRecipe;