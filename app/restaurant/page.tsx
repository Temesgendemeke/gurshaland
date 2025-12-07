"use client";
import BackNavigation from "@/components/BackNavigation";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
// import { searchSchema } from "@/schema/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  IceCream,
  LocateIcon,
  Map,
  MapPin,
  Search,
  StarIcon,
  StarsIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { Restaurant } from "@/utils/types/restaurant";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
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

const page = () => {
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

  const onSubmit = async (data) => {
    console.log(data);
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
    <>
      <Header />

      <div className="px-4 pt-2">
        <BackNavigation />

        {/* hero text */}
        <div>
          <div className="py-16 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent ">
              The Hottest Lounge Search Engine
            </h1>

            <div className="max-w-6xl mx-auto mt-10 px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-xl shadow-lg border border-border/50"
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
                            className="pl-10  md: bg-background border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
                          />
                        </div>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="md:w-auto px-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg"
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
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-5 mt-10">
                  {restaurants?.map((restaurant, index) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 mb-10 self-center">
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
                                </PaginationItem>
                              );
                            }
                          } else {
                            // Always show first page
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
                              </PaginationItem>
                            );

                            // Show ellipsis if current page is far from start
                            if (pageParam > 3) {
                              items.push(
                                <PaginationItem key="ellipsis-start">
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }

                            // Calculate start and end of dynamic window
                            let startPage = Math.max(2, pageParam - 1);
                            let endPage = Math.min(
                              totalPages - 1,
                              pageParam + 1
                            );

                            // Adjust if near start
                            if (pageParam <= 3) {
                              endPage = 4;
                              startPage = 2;
                            }

                            // Adjust if near end
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
                                </PaginationItem>
                              );
                            }

                            // Show ellipsis if current page is far from end
                            if (pageParam < totalPages - 2) {
                              items.push(
                                <PaginationItem key="ellipsis-end">
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }

                            // Always show last page
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
                              </PaginationItem>
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
