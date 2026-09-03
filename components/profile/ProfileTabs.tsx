"use client";

import React, { useState } from "react";
import RecipeCard from "@/components/recipe/RecipeCard";
import BlogPostCard from "@/components/BlogPostCard";
import { Profile } from "@/utils/types/profile";
import { Blog } from "@/utils/types/blog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface ProfileTabsProps {
  profile: Profile;
  blogs: Blog[];
  isOwn: boolean;
}

export default function ProfileTabs({
  profile,
  blogs,
  isOwn,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("recipes");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="mt-6"
    >
      <TabsList className="h-11 rounded-xl bg-muted/70 p-1.5">
        <TabsTrigger
          value="recipes"
          className="gap-2 rounded-lg px-4 data-[state=active]:shadow-sm"
        >
          Recipes
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
            {profile.recipes.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="blogs"
          className="gap-2 rounded-lg px-4 data-[state=active]:shadow-sm"
        >
          Blogs
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
            {blogs.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="recipes" className="mt-8">
        {profile.recipes.length ? (
          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profile.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id ?? recipe.slug}
                badge={
                  isOwn && recipe.status === "draft" ? "Draft" : undefined
                }
                recipe={{
                  ...recipe,
                  author_id: (recipe as any).author_id || profile.id,
                  slug: recipe.slug,
                  author: {
                    id: profile.id,
                    username: profile.username,
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url,
                    bio: profile.bio || "",
                    recipes: Array.isArray(profile.recipes)
                      ? profile.recipes.length
                      : 0,
                  },
                }}
                isOwn={isOwn}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recipes yet"
            message={
              isOwn
                ? "Share your first recipe to start building your collection."
                : "This cook hasn't shared any recipes."
            }
          />
        )}
      </TabsContent>

      <TabsContent value="blogs" className="mt-8">
        {blogs.length ? (
          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogPostCard
                key={blog.id ?? blog.slug}
                post={{
                  ...blog,
                  author_id: (blog as any).author_id || profile.id,
                }}
                badge={
                  isOwn && blog.status === "draft" ? "Draft" : undefined
                }
                isOwn={isOwn}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No blogs yet"
            message={
              isOwn
                ? "Write your first post to share stories with the community."
                : "This author hasn't written any blogs."
            }
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
