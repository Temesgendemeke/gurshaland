"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
// import { searchSchema } from "@/schema/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Search, StarsIcon } from "lucide-react";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getAllRestaurants } from "@/actions/restaurant/crud";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import RecipeListSkeleton from "@/components/skeleton/RecipeList";

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const RestaurantsPageContent = () => {
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const onSubmit = async (data: SearchFormValues) => {
    // TODO: wire up server-side search when available
  };

  const { data: restaurantsResponse, isLoading } = useQuery({
    queryKey: ["restaurants", pageParam],
    queryFn: () => getAllRestaurants(pageParam, limit),
    placeholderData: keepPreviousData,
  });

  const restaurants = restaurantsResponse?.data || [];
  const totalCount = restaurantsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="">
      <Header />

      <main className="mx-auto w-[calc(100%-1rem)] max-w-7xl px-4 sm:px-6 py-12 mt-6 md:mt-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-gosh">
            Discover the{" "}
            <span className="gradient-text-primary">hottest</span> lounges
          </h1>
          <p className="mt-3 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Search, explore, and find your next favorite spot.
          </p>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="modern-card bg-card/70 backdrop-blur-sm flex flex-col md:flex-row gap-3 p-4 sm:p-5 rounded-2xl border border-border/50 shadow-sm"
            >
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Search for a lounge..."
                        className="pl-10 h-12 bg-background/60 text-foreground border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-colors"
                      />
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="h-12 md:w-auto px-6 w-full btn-primary-modern "
              >
                <StarsIcon className="w-5 h-5" />
                <span>Search</span>
              </Button>
            </form>
          </Form>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <RecipeListSkeleton />
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {restaurants?.map((restaurant) => (
                <div key={restaurant.id} className="h-full">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 mb-2 flex justify-center">
                <div className="modern-card bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pageParam > 1) {
                              router.push(`?page=${pageParam - 1}`);
                            }
                          }}
                          className={
                            pageParam <= 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {(() => {
                        const items = [];
                        const maxVisiblePages = 5;

                        if (totalPages <= maxVisiblePages) {
                          for (let i = 1; i <= totalPages; i++) {
                            items.push(
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`?page=${i}`);
                                  }}
                                  isActive={pageParam === i}
                                >
                                  {i}
                                </PaginationLink>
                              </PaginationItem>,
                            );
                          }
                        } else {
                          items.push(
                            <PaginationItem key={1}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push(`?page=1`);
                                }}
                                isActive={pageParam === 1}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>,
                          );

                          if (pageParam > 3) {
                            items.push(
                              <PaginationItem key="ellipsis-start">
                                <PaginationEllipsis />
                              </PaginationItem>,
                            );
                          }

                          let startPage = Math.max(2, pageParam - 1);
                          let endPage = Math.min(totalPages - 1, pageParam + 1);

                          if (pageParam <= 3) {
                            endPage = 4;
                            startPage = 2;
                          }

                          if (pageParam >= totalPages - 2) {
                            startPage = totalPages - 3;
                            endPage = totalPages - 1;
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            items.push(
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`?page=${i}`);
                                  }}
                                  isActive={pageParam === i}
                                >
                                  {i}
                                </PaginationLink>
                              </PaginationItem>,
                            );
                          }

                          if (pageParam < totalPages - 2) {
                            items.push(
                              <PaginationItem key="ellipsis-end">
                                <PaginationEllipsis />
                              </PaginationItem>,
                            );
                          }

                          items.push(
                            <PaginationItem key={totalPages}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push(`?page=${totalPages}`);
                                }}
                                isActive={pageParam === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>,
                          );
                        }

                        return items;
                      })()}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pageParam < totalPages) {
                              router.push(`?page=${pageParam + 1}`);
                            }
                          }}
                          className={
                            pageParam >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<RecipeListSkeleton />}>
      <RestaurantsPageContent />
    </Suspense>
  );
}
