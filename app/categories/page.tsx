import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Recipe Categories
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                  .replace(/\s+/g, "-")}`}
              >
                <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl hover:scale-105 transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 h-full">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r  ${
                          category.color || "from-emerald-500 to-blue-500"
                        } rounded-full flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/90 text-gray-800 mb-2">
                        {category.featured?.length || 0} recipes
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured recipes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.featured
                          ?.slice(0, 3)
                          .map((recipe: any, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs dark:bg-gray-700 dark:text-gray-300"
                            >
                              {recipe.title}
                            </Badge>
                          ))}
                        {(!category.featured ||
                          category.featured.length === 0) && (
                          <Badge
                            variant="secondary"
                            className="text-xs dark:bg-gray-700 dark:text-gray-300"
                          >
                            No recipes yet
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
