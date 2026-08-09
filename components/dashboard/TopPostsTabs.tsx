"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SimpleTable } from "./SimpleTable";
import { Post } from "@/utils/types/Dashboard";

interface TopPostsTabsProps {
  recipes: Post[];
  blogs: Post[];
  loading: boolean;
}

export function TopPostsTabs({ recipes, blogs, loading }: TopPostsTabsProps) {
  return (
    <Tabs defaultValue="recipes">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="recipes" className="flex-1 sm:flex-none">
          Recipes
        </TabsTrigger>
        <TabsTrigger value="blogs" className="flex-1 sm:flex-none">
          Blogs
        </TabsTrigger>
      </TabsList>
      <TabsContent value="recipes" className="mt-3">
        <SimpleTable
          data={recipes}
          name="Recipe"
          loading={loading}
          type="recipe"
        />
      </TabsContent>
      <TabsContent value="blogs" className="mt-3">
        <SimpleTable data={blogs} name="Blog" loading={loading} type="blog" />
      </TabsContent>
    </Tabs>
  );
}
