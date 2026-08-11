"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { IconMapPin as MapPin, IconStar as Star } from "@tabler/icons-react";
import { GetRestaurentType } from "@/schema/restaurent";
import { useReducedMotion } from "motion/react";

const RestaurantCard = ({ restaurant }: { restaurant: GetRestaurentType }) => {
  const router = useRouter();
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

  const handleClick = () => {
    router.push(`/restaurant/${restaurant.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${restaurant.name}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={correctUrl(imageSrc)}
          alt={restaurant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            reduceMotion ? "" : "group-hover:scale-105"
          }`}
          onError={() => setImageSrc("/placeholder.svg")}
        />

        {/* Cuisine Tag */}
        {primaryCuisine && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-background">
            {primaryCuisine}
          </span>
        )}

        {/* Rating */}
        {restaurant.rating !== null && restaurant.rating !== undefined && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={1.5} />
            <span className="text-xs font-bold">{Number(restaurant.rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-gosh text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
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
    </Card>
  );
};

export default RestaurantCard;