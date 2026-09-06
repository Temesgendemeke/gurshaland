import React from "react";
import { ChefHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FallbackImage } from "@/components/fallback-image";

interface MenuItem {
  name: string;
  description?: string;
  price?: {
    amount?: number | string;
    currency?: string;
  };
  image?: {
    url?: string;
  };
  tags?: string[];
}

interface RestaurantMenuSectionProps {
  menu: MenuItem[];
}

export default function RestaurantMenuSection({ menu }: RestaurantMenuSectionProps) {
  const activeMenu = (menu || []).filter(
    (item) => item && item.name?.trim().length > 0,
  );

  if (activeMenu.length === 0) return null;

  const formatPrice = (price?: { amount?: number | string; currency?: string }) => {
    if (!price || price.amount == null) return null;
    const currency = price.currency || "ETB";
    return `${currency} ${Number(price.amount).toLocaleString("en-US")}`;
  };

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden shadow-none">
      <div className="p-4 sm:p-6 md:p-7 pb-3 sm:pb-5 border-b border-border/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-gosh text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Menu Highlights
          </h2>
          <span className="font-mono text-[11px] sm:text-xs font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5 bg-muted/40">
            {activeMenu.length}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
          Signature courses & pricing
        </span>
      </div>

      <div className="divide-y divide-border/60">
        {activeMenu.map((item, idx) => {
          const price = formatPrice(item.price);
          return (
            <div
              key={`${item.name}-${idx}`}
              className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-3 p-4 sm:p-6 hover:bg-muted/25 transition-colors"
            >
              <div className="min-w-0 flex-1 pr-0 sm:pr-4">
                <div className="flex items-center justify-between gap-2 sm:block">
                  <h3 className="font-medium text-sm sm:text-base text-foreground transition-colors group-hover:text-primary">
                    {item.name}
                  </h3>
                  {price && (
                    <span className="font-mono text-xs font-semibold text-primary sm:hidden shrink-0">
                      {price}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-medium border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {price && (
                <span className="font-mono text-xs sm:text-sm font-semibold text-foreground tracking-tight shrink-0 hidden sm:inline-block">
                  {price}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
