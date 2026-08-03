import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getCategories } from "@/actions/Recipe/category";
import { getIconComponent } from "@/utils/icon-mapper";
import Image from "next/image";

export default async function CategoriesPage() {
  const categories = await getCategories();
  console.log(categories);

  return (
    <div className="">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 mt-6 md:mt-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Recipe Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore Ethiopian cuisine by category - from traditional breads to
            aromatic spices
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: any) => {
            const IconComponent = getIconComponent(category.icon);

            return (
              <Link
                key={category.id}
                href={`/categories/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}?id=${category.id}`}
              >
                <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl  group bg-card/70 backdrop-blur-sm border-primary/20 h-full">
                  <div className="relative">
                    {/* Category Image */}
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover  transition-transform duration-300"
                      loading="lazy"
                      width={500}
                      height={500}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6  text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-background/80 border border-border/60 text-foreground mb-2">
                        {category.recipe_count || 0} recipes
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>

                    {/* <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Featured recipes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.featured
                          ?.slice(0, 3)
                          .map((recipe: any, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {recipe.title}
                            </Badge>
                          ))}
                        {(!category.featured ||
                          category.featured.length === 0) && (
                          <Badge variant="secondary" className="text-xs">
                            No recipes yet
                          </Badge>
                        )}
                      </div>
                    </div> */}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
