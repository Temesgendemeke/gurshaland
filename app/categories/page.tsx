import React from "react";
import { Header } from "@/components/header";
import Link from "next/link";
import { getCategories } from "@/actions/Recipe/category";
import { getIconComponent } from "@/utils/icon-mapper";
import Image from "next/image";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-[100dvh]">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pt-14 pb-24 sm:px-6 md:pt-10">
        {/* Header */}
        <header className=" border-b pb-6">
          <h1 className="font-gosh text-5xl font-semibold leading-[1.04] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
            Recipe Categories
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Explore Ethiopian cuisine by category, from traditional breads to
            aromatic spices
          </p>
        </header>

        {/* Categories Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => {
            const IconComponent = getIconComponent(category.icon);

            return (
              <Link
                key={category.id}
                href={`/categories/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}?id=${category.id}`}
                className="group block h-full overflow-hidden rounded-lg border border-border/70 bg-card transition-colors duration-200 hover:border-foreground/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* Category Image */}
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {category.recipe_count || 0} recipes
                  </div>
                  <h3 className="mb-2 font-gosh text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                  </h3>
                  <p className="mb-4 text-muted-foreground">
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
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
