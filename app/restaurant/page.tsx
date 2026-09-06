"use client";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  IconSearch as Search,
  IconPlus as Plus,
  IconMapPin as MapPin,
} from "@tabler/icons-react";
import Link from "next/link";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import RestaurantCardSkeleton from "@/components/restaurant/RestaurantCardSkeleton";
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
import { useReducedMotion } from "motion/react";

const searchSchema = z.object({
  query: z.string(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

function PaginationControls({
  pageParam,
  totalPages,
  router,
}: {
  pageParam: number;
  totalPages: number;
  router: ReturnType<typeof useRouter>;
}) {
  if (totalPages <= 1) return null;

  const items: React.ReactNode[] = [];

  const createPageLink = (page: number, label?: string) => (
    <PaginationItem key={page}>
      <PaginationLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          router.push(`?page=${page}`);
        }}
        isActive={pageParam === page}
      >
        {label ?? page}
      </PaginationLink>
    </PaginationItem>
  );

  items.push(
    <PaginationItem key="prev">
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (pageParam > 1) router.push(`?page=${pageParam - 1}`);
        }}
        className={pageParam <= 1 ? "pointer-events-none opacity-50" : ""}
      />
    </PaginationItem>
  );

  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(createPageLink(i));
    }
  } else {
    items.push(createPageLink(1));

    if (pageParam > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
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
      items.push(createPageLink(i));
    }

    if (pageParam < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(createPageLink(totalPages));
  }

  items.push(
    <PaginationItem key="next">
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (pageParam < totalPages) router.push(`?page=${pageParam + 1}`);
        }}
        className={pageParam >= totalPages ? "pointer-events-none opacity-50" : ""}
      />
    </PaginationItem>
  );

  return (
    <Pagination>
      <PaginationContent>{items}</PaginationContent>
    </Pagination>
  );
}

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
  const reduceMotion = useReducedMotion();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const queryValue = form.watch("query");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(queryValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [queryValue]);

  const onSubmit = async (data: SearchFormValues) => {
    // Search happens automatically on input change
  };

  // Scroll to search when query changes
  useEffect(() => {
    if (resultsRef.current && debouncedQuery) {
      const y =
        resultsRef.current.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [debouncedQuery, reduceMotion]);

  const { data: restaurantsResponse, isLoading } = useQuery({
    queryKey: ["restaurants", pageParam, debouncedQuery],
    queryFn: () => getAllRestaurants(pageParam, limit, debouncedQuery),
    placeholderData: keepPreviousData,
  });

  const restaurants = restaurantsResponse?.data || [];
  const totalCount = restaurantsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-[100dvh]">
      <Header />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Page Header */}
        <div className="max-w-3xl">
          <h1 className="font-gosh text-2xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Find a table in Addis Ababa
          </h1>

          <p className="mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-base leading-relaxed text-muted-foreground md:text-lg">
            From sizzling kitfo joints to sunset terrace lounges, the spots
            where the berbere, the coffee, and the company are all worth
            staying for.
          </p>
        </div>

        {/* Search */}
        <div ref={resultsRef} className="mt-6 sm:mt-10 max-w-4xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <div className="relative">
                    <Search
                      className="absolute left-3.5 sm:left-4 top-1/2 h-4 sm:h-5 w-4 sm:w-5 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <Input
                      {...field}
                      placeholder="Search for a restaurant, cuisine, or area"
                      className="h-11 sm:h-12 border-border bg-card pl-11 sm:pl-12 text-sm"
                    />
                  </div>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mt-8 flex items-center justify-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span>
              <strong className="font-semibold text-foreground">{totalCount}</strong>{" "}
              {totalCount === 1 ? "restaurant" : "restaurants"} in Addis Ababa
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="mt-8" aria-busy="true" aria-live="polite">
            <RestaurantCardSkeleton />
          </div>
        ) : (
          <div className="mt-8">
            <div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
              role="list"
              aria-label="Restaurant listings"
            >
              {restaurants?.map((restaurant) => (
                <div key={restaurant.id} className="h-full" role="listitem">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center" role="navigation" aria-label="Pagination">
                <PaginationControls
                  pageParam={pageParam}
                  totalPages={totalPages}
                  router={router}
                />
              </div>
            )}

            {restaurants.length === 0 && !isLoading && (
              <div className="mt-16 py-12 text-center">
                <p className="text-muted-foreground">
                  No restaurants found.
                </p>
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
    <Suspense fallback={<RestaurantCardSkeleton />}>
      <RestaurantsPageContent />
    </Suspense>
  );
}