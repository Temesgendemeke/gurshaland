import React from "react";
import { MapPin, Star, UtensilsCrossed } from "lucide-react";
import { FallbackImage } from "@/components/fallback-image";

interface RestaurantHeroBannerProps {
  name: string;
  heroImage?: string | null;
  rating?: number | null;
  reviewCount?: number;
  menuLength?: number;
  address?: string;
}

export default function RestaurantHeroBanner({
  name,
  heroImage,
  rating,
  reviewCount = 0,
  menuLength = 0,
  address,
}: RestaurantHeroBannerProps) {
  return (
    <div className="relative min-h-0 sm:min-h-[220px] md:min-h-[260px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card sm:bg-muted flex flex-col justify-end p-4 sm:p-5 md:p-6 shadow-none">
      {/* Background Photo - Hidden on mobile devices */}
      {heroImage ? (
        <div className="hidden sm:block absolute inset-0">
          <FallbackImage
            src={heroImage}
            alt={name}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
      ) : (
        <div className="hidden sm:flex absolute inset-0 items-center justify-center bg-muted/60">
          <UtensilsCrossed
            className="h-10 w-10 text-muted-foreground/30"
            strokeWidth={1.2}
          />
        </div>
      )}

      {/* Crisp Gradient Overlay (Only on sm: and up where image exists) */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 via-45% to-transparent pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 max-w-4xl space-y-1.5 sm:space-y-2">
        <h1 className="font-gosh text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground sm:text-white leading-tight break-words">
          {name}
        </h1>

        {/* Micro-Pills Row */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
          {rating !== null && rating !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 bg-amber-500/10 sm:bg-black/65 sm:backdrop-blur-md px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300 sm:text-amber-300 shadow-none shrink-0">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500 sm:fill-amber-400 sm:text-amber-400 shrink-0" />
              <span>{Number(rating).toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-muted-foreground sm:text-white/70 font-normal">
                  ({reviewCount})
                </span>
              )}
            </span>
          )}

          {menuLength > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border sm:border-white/20 bg-muted/60 sm:bg-black/65 sm:backdrop-blur-md px-2 py-0.5 text-[11px] sm:text-xs text-foreground sm:text-white/90 shadow-none shrink-0">
              <UtensilsCrossed
                className="h-3 w-3 text-muted-foreground sm:text-white/75 shrink-0"
                strokeWidth={1.5}
              />
              <span>
                {menuLength} {menuLength === 1 ? "dish" : "dishes"}
              </span>
            </span>
          )}

          {address && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border sm:border-white/20 bg-muted/60 sm:bg-black/65 sm:backdrop-blur-md px-2 py-0.5 text-[11px] sm:text-xs text-foreground sm:text-white/95 shadow-none max-w-full">
              <MapPin
                className="h-3 w-3 text-muted-foreground sm:text-white/75 shrink-0"
                strokeWidth={1.5}
              />
              <span className="truncate max-w-[190px] xs:max-w-[240px] sm:max-w-xs md:max-w-md font-normal">
                {address}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
