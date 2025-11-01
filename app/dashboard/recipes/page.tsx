"use client";
import { postColumn } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import useRecipe from "@/store/DashboardRecipe";
import { useAuth } from "@/store/useAuth";
import { Post } from "@/utils/types/Dashboard";
import { Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const DashBoardRecipe = () => {
  const fetchRecipes = useRecipe((store) => store.fetchRecipes);
  const loading = useRecipe((store) => store.loading);
  const user = useAuth((store) => store.user);
  const recipes = useRecipe((store) => store.recipes);
  const router = useRouter()
  const deleteRecipe = useRecipe((store) => store.deleteRecipe)


  useEffect(() => {
    console.log('Recipes in component:', recipes);
    console.log('Loading state:', loading);
    if(user?.id){
      fetchRecipes(user.id);
    }
  }, [user?.id]);

  const handleDelete = async (rows: Post[]) => {
    try{
      for (const row of rows) {
        await deleteRecipe(row.slug!);
        toast.success(`${row.title} recipe deleted successfully`)
      }
      // Refetch recipes to ensure the list is updated
      if (user && user.id) {
        fetchRecipes(user.id);
      }
    }catch(error){
      toast.error("Failed to delete recipe")
    }
  }
  return (
    <div className="mx-5 md:mx-10">
      <div className="mt-4 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-4">Your Recipe Posts</h2>
        <p className="mb-6 text-gray-600">
          Here’s a creative overview of all your recipe sections. Track
          progress, assign reviewers, and cook up something amazing!
        </p>
      </div>
      {loading ?  <p>loading</p>: null}

      <div className="flex justify-end">
         <Button className="btn-primary-modern rounded-lg  " onClick={() => router.push('/recipes/create')}>
          <Plus/>
          <span>Add Recipe</span>
      </Button>
      </div>
     
      <DataTable<Post, any>
        columns={postColumn}
        data={recipes}
        loading={loading}
        onDeleteSelected={handleDelete}
      />
    </div>
  );
};

export default DashBoardRecipe;
