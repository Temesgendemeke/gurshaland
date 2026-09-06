"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  categoryStore,
  slugifyCategory,
} from "@/store/Category";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/utils/types/category";

const CategoryHeader = () => {
  const params = useParams<{ category: string }>();
  const slug = params?.category ?? "";

  const categories = categoryStore((state) => state.categories);
  const loading = categoryStore((state) => state.loading);
  const error = categoryStore((state) => state.error);
  const fetchCategories = categoryStore((state) => state.fetchCategories);

  useEffect(() => {
    if (!categories) void fetchCategories();
  }, [categories, fetchCategories]);

  const currentCategory: Category | undefined = categories?.find(
    (category) => slugifyCategory(category.name) === slug,
  );

  if (loading && !currentCategory) {
    return (
      <header className="mb-12">
        <Skeleton className="h-12 w-2/3 max-w-md sm:h-16" />
        <Skeleton className="mt-6 h-5 w-full max-w-xl" />
        <Skeleton className="mt-2 h-5 w-3/4 max-w-lg" />
      </header>
    );
  }

  return (
    <header className="mb-10 border-b pb-6 sm:mb-12">
      <h1 className="font-gosh text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        <span className="capitalize">
          {currentCategory?.name ?? slug.replace(/-/g, " ")}
        </span>
      </h1>
      {currentCategory?.description ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {currentCategory.description}
        </p>
      ) : error ? (
        <p className="mt-4 max-w-2xl text-sm text-error">{error}</p>
      ) : null}
    </header>
  );
};

export default CategoryHeader;
