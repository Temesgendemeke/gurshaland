import { getRestaurantBySlug } from "@/actions/restaurant/crud";
import { Header } from "@/components/header";
import { ArrowLeft, ChefHat, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import RestaurantOwnerActions from "@/components/restaurant/RestaurantOwnerActions";
import RestaurantShareButton from "@/components/restaurant/RestaurantShareButton";
import RestaurantJsonLd from "@/components/restaurant/RestaurantJsonLd";
import RestaurantHeroBanner from "@/components/restaurant/RestaurantHeroBanner";
import RestaurantMenuSection from "@/components/restaurant/RestaurantMenuSection";
import RestaurantGallerySection from "@/components/restaurant/RestaurantGallerySection";
import RestaurantSidebar from "@/components/restaurant/RestaurantSidebar";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground/40 mb-3" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold text-foreground">Restaurant not found</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            This dining spot may have been removed or the URL could be mistyped.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-5 border-border shadow-none">
            <Link href="/restaurant" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Directory</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = Boolean(
    user?.id && (
      user.id === restaurant.author_id ||
      user.id === (restaurant as any).author?.id ||
      user.id === (restaurant as any).user_id
    )
  );

  const rawCategory = (restaurant as any).category;
  const parsedCategories: string[] = Array.isArray(rawCategory)
    ? rawCategory
        .map((cat: any) => (typeof cat === "string" ? cat : cat?.name))
        .filter(Boolean)
    : typeof rawCategory === "string"
      ? [rawCategory]
      : rawCategory?.name
        ? [rawCategory.name]
        : [];

  const rawCuisines = Array.isArray(restaurant.cuisines)
    ? restaurant.cuisines.filter(
        (c: string) => typeof c === "string" && c.trim().length > 0
      )
    : [];

  const allTags = Array.from(
    new Set([...parsedCategories, ...rawCuisines].map((t) => t.trim()))
  ).filter(Boolean);

  const mapsUrl =
    restaurant.google_map_url ||
    (restaurant.address
      ? `https://maps.google.com/?q=${encodeURIComponent(
          `${restaurant.name}, ${restaurant.address}`
        )}`
      : "");

  const heroImage = (restaurant as any).image?.url;
  const rawReview = (restaurant as any).review;
  const reviewCount = Array.isArray(rawReview)
    ? rawReview.length
    : typeof rawReview === "number"
      ? rawReview
      : parseInt(String(rawReview || ""), 10) || 0;

  const menu = restaurant.menu || [];
  const gallery = (restaurant as any).gallery || [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <RestaurantJsonLd restaurant={restaurant} />
      <Header />

      <main className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 md:py-8">
        {/* Top Navigation & Owner Actions */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4">
          <Link
            href="/restaurant"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Restaurants</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <RestaurantShareButton name={restaurant.name} />
            {isOwner && (
              <RestaurantOwnerActions
                restaurantId={restaurant.id}
                slug={slug}
                name={restaurant.name}
              />
            )}
          </div>
        </div>

        {/* Responsive Header Banner */}
        <RestaurantHeroBanner
          name={restaurant.name}
          heroImage={heroImage}
          rating={restaurant.rating}
          reviewCount={reviewCount}
          menuLength={menu.length}
          address={restaurant.address}
        />

        {/* 2-Column Content Grid */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Main Details & Menu Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Tags Strip */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {allTags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:bg-muted/40 transition-colors shadow-none"
                  >
                    <ChefHat className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={1.5} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* About Section */}
            {restaurant.description && (
              <section className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-7 shadow-none">
                <h2 className="font-gosh text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">
                  About
                </h2>
                <p className="text-foreground/90 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {restaurant.description}
                </p>
              </section>
            )}

            {/* Menu Highlights */}
            <RestaurantMenuSection menu={menu} />

            {/* Atmosphere & Gallery */}
            <RestaurantGallerySection
              gallery={gallery}
              restaurantName={restaurant.name}
            />
          </div>

          {/* Location & Contact Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <RestaurantSidebar
              name={restaurant.name}
              address={restaurant.address}
              mapsUrl={mapsUrl}
              phone={restaurant.phone}
              email={restaurant.email}
              website={restaurant.website}
              city={(restaurant as any).city}
              country={(restaurant as any).country}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
