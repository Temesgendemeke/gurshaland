import React from "react";
import { FallbackImage } from "@/components/fallback-image";

interface GalleryImage {
  id?: string;
  url: string;
}

interface RestaurantGallerySectionProps {
  gallery: (GalleryImage | string)[];
  restaurantName: string;
}

export default function RestaurantGallerySection({
  gallery,
  restaurantName,
}: RestaurantGallerySectionProps) {
  const activeGallery = (gallery || []).filter(Boolean);

  if (activeGallery.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-7 shadow-none">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <h2 className="font-gosh text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Atmosphere & Gallery
        </h2>
        <span className="font-mono text-[11px] sm:text-xs font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5 bg-muted/40">
          {activeGallery.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
        {activeGallery.map((item, idx) => {
          const imgUrl = typeof item === "string" ? item : item.url;
          return (
            <div
              key={idx}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-border/80 bg-muted"
            >
              <FallbackImage
                src={imgUrl}
                alt={`${restaurantName} photo ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
