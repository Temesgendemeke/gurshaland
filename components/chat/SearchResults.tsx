"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import type {
  RestaurantSearchItem,
  RecipeSearchItem,
} from "@/lib/chat-actions";
import { cn } from "@/lib/utils";

type ResultItem = RestaurantSearchItem | RecipeSearchItem;

function isRestaurant(item: ResultItem): item is RestaurantSearchItem {
  return "name" in item && !("title" in item);
}

function RatingBadge({ rating }: { rating?: number | null }) {
  if (rating === null || rating === undefined) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-background px-2 py-0.5 text-[0.6875rem] font-bold text-foreground">
      <Star className="h-3 w-3 fill-warning text-warning" strokeWidth={1.5} />
      {Number(rating).toFixed(1)}
    </span>
  );
}

function Thumbnail({ url, alt }: { url?: string; alt: string }) {
  return (
    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted">
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <span className="grid h-full w-full place-items-center text-[0.6875rem] font-bold text-muted-foreground">
          {alt.slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function Matches({ items }: { items?: string[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {items.slice(0, 3).map((item) => (
        <span
          key={item}
          className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.625rem] font-medium text-primary"
        >
          {item}
        </span>
      ))}
      {items.length > 3 && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
          +{items.length - 3}
        </span>
      )}
    </div>
  );
}

export default function SearchResults({
  items,
  kind,
  label,
  className,
}: {
  items: ResultItem[];
  kind: "restaurant" | "recipe";
  label?: string;
  className?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("mt-2 w-full", className)}>
      {label && (
        <p className="mb-1.5 pl-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
      {items.map((item) => {
        if (isRestaurant(item)) {
          const location = item.city || item.address || "Addis Ababa";
          return (
            <Link
              key={`r-${item.id}`}
              href={`/restaurant/${item.slug}`}
              className="flex items-center gap-3 rounded-[0.875rem] border border-border/70 bg-card/80 p-2.5 transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-primary/40 hover:bg-card active:scale-[0.99]"
            >
              <Thumbnail url={item.image?.url} alt={item.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <RatingBadge rating={item.rating} />
                </div>
                <p className="mt-0.5 flex items-center gap-1 truncate text-[0.6875rem] text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
                  {location}
                </p>
                {item.cuisines && item.cuisines.length > 0 && (
                  <Matches items={item.cuisines} />
                )}
              </div>
            </Link>
          );
        }

        const totalTime = (item.cooktime ?? 0) + (item.preptime ?? 0);
        return (
          <Link
            key={`c-${item.id}`}
            href={`/recipes/${item.slug}`}
            className="flex items-center gap-3 rounded-[0.875rem] border border-border/70 bg-card/80 p-2.5 transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-primary/40 hover:bg-card active:scale-[0.99]"
          >
            <Thumbnail url={item.image?.url} alt={item.title} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <RatingBadge rating={item.rating} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
                {item.difficulty && (
                  <span className="capitalize">{item.difficulty}</span>
                )}
                {totalTime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {totalTime}m
                  </span>
                )}
              </div>
              {item.matched_ingredients && item.matched_ingredients.length > 0 && (
                <Matches items={item.matched_ingredients} />
              )}
            </div>
          </Link>
        );
      })}
      </div>
    </div>
  );
}
