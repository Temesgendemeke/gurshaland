"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconMapPin as MapPin, IconStar as Star } from "@tabler/icons-react";
import { GetRestaurentType } from "@/schema/restaurent";
import { useReducedMotion } from "motion/react";

const RestaurantCard = ({ restaurant }: { restaurant: GetRestaurentType }) => {
  const reduceMotion = useReducedMotion();
  const [imageSrc, setImageSrc] = useState(
    restaurant?.image?.url || "/placeholder.svg",
  );

  const correctUrl = (url: string) => {
    if (url.includes("https://static.playfood.com/")) {
      return url.replace(/\.com\/\//g, ".com/");
    }
    if (!url) {
      return "/placeholder.svg";
    }
    return url;
  };

  const location = restaurant.city || restaurant.address || "Addis Ababa";
  const primaryCuisine = restaurant.cuisines?.[0];

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-colors duration-200 hover:border-foreground/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      aria-label={`View ${restaurant.name}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={correctUrl(imageSrc)}
          alt={restaurant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            reduceMotion ? "" : "group-hover:scale-[1.025]"
          }`}
          onError={() => setImageSrc("/placeholder.svg")}
        />

      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="truncate">{primaryCuisine || "Restaurant"}</span>
          {restaurant.rating !== null && restaurant.rating !== undefined && (
            <span className="inline-flex shrink-0 items-center gap-1 text-foreground normal-case tracking-normal">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={1.5} />
              {Number(restaurant.rating).toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 font-gosh text-xl font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {restaurant.name}
        </h3>

        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {restaurant.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-4 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary/80" strokeWidth={1.5} />
          <span className="truncate text-sm font-medium">
            {location.length > 34 ? location.slice(0, 34) + "…" : location}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
