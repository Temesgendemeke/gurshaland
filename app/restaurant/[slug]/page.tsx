import { getRestaurantBySlug } from "@/actions/restaurant/crud";
import { Header } from "@/components/header";
import {
  IconMapPin as MapPin,
  IconStar as Star,
  IconPhone as Phone,
  IconGlobe as Globe,
  IconMail as Mail,
  IconCooker as UtensilsCrossed,
  IconChevronLeft as ChevronLeft,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FallbackImage } from "@/components/fallback-image";
import Link from "next/link";

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="font-gosh text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      {title}
    </h2>
  );
}

function BackButton({ href, className }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={className}
      aria-label="Back to restaurants"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-colors hover:bg-black/40">
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </div>
    </Link>
  );
}

export default async function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground text-lg">Restaurant not found.</p>
        </div>
      </div>
    );
  }

  const categories =
    (restaurant as any).category &&
    (Array.isArray((restaurant as any).category)
      ? (restaurant as any).category.map((cat: any) => cat.name || cat)
      : [typeof (restaurant as any).category === "object"
          ? ((restaurant as any).category as any).name
          : (restaurant as any).category]);

  const hasDirections = restaurant.google_map_url || restaurant.address;
  const heroImage = (restaurant as any).image?.url;

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      {/* Hero Section - Asymmetric, content left, image right on desktop */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6 md:mt-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/60">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {heroImage ? (
              <FallbackImage
                src={heroImage}
                alt={restaurant.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <UtensilsCrossed className="h-14 w-14 opacity-10" strokeWidth={1.5} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
          </div>

          {/* Hero Content - Left aligned, not bottom-centered */}
          <div className="relative z-10 py-10 md:py-16 px-6 md:px-10 lg:max-w-2xl">
            <BackButton href="/restaurant" className="mb-6 inline-flex" />

            <div className="flex flex-col gap-4">
              {categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: string, idx: number) => (
                    <Badge
                      key={`${cat}-${idx}`}
                      variant="outline"
                      className="border-white/20 bg-black/30 text-white hover:bg-black/40"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="font-gosh text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                {restaurant.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/90 md:text-base">
                {restaurant.rating !== null &&
                  restaurant.rating !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 fill-secondary text-secondary" strokeWidth={1.5} />
                      <span>{Number(restaurant.rating).toFixed(1)}</span>
                      {(restaurant as any).review ? (
                        <span className="text-white/70">
                          ({(restaurant as any).review} reviews)
                        </span>
                      ) : null}
                    </div>
                  )}

                {restaurant.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                    <span>{restaurant.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-10 md:pt-14 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Menu */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          {restaurant.description && (
            <section>
              <SectionHeading title="About" />
              <p className="mt-4 text-body text-lg leading-relaxed max-w-prose">
                {restaurant.description}
              </p>
            </section>
          )}

          {/* Cuisines Section */}
          {restaurant.cuisines && restaurant.cuisines.length > 0 && (
            <section>
              <SectionHeading title="Cuisines" />
              <div className="mt-4 flex flex-wrap gap-2.5">
                {restaurant.cuisines.map((cuisine: string, idx: number) => (
                  <span
                    key={`${cuisine}-${idx}`}
                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {cuisine}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {(restaurant as any).gallery &&
            (restaurant as any).gallery.length > 0 && (
              <section>
                <SectionHeading title="Gallery" />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(restaurant as any).gallery.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
                    >
                      <FallbackImage
                        src={img.url}
                        alt={`Gallery view ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Menu Section */}
          {restaurant.menu && restaurant.menu.length > 0 && (
            <section>
              <div className="flex items-end justify-between gap-4">
                <SectionHeading title="Menu Highlights" />
                <span className="mb-1 hidden text-sm font-medium text-muted-foreground sm:block">
                  {restaurant.menu.length}{" "}
                  {restaurant.menu.length === 1 ? "dish" : "dishes"}
                </span>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card">
                {restaurant.menu.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-baseline sm:gap-4 border-t border-border/40 first:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.name}
                      </h3>
                      {item.description ? (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="font-gosh text-lg font-bold whitespace-nowrap text-primary">
                      {item.price?.amount} {item.price?.currency}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Info Card */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-gosh text-xl font-bold tracking-tight text-foreground">
                Info & Contact
              </h3>
              <Separator className="my-5 opacity-40" />

              <ul className="space-y-5">
                {restaurant.address && (
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                      <MapPin className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Address
                      </span>
                      <span className="mt-0.5 block font-medium text-foreground">
                        {restaurant.address}
                      </span>
                      {(restaurant.city || restaurant.country) && (
                        <span className="text-sm text-muted-foreground">
                          {[restaurant.city, restaurant.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                    </div>
                  </li>
                )}

                {restaurant.phone && (
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                      <Phone className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Phone
                      </span>
                      <span className="mt-0.5 block font-medium text-foreground">
                        {restaurant.phone}
                      </span>
                    </div>
                  </li>
                )}

                {restaurant.email && (
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                      <Mail className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Email
                      </span>
                      <a
                        href={`mailto:${restaurant.email}`}
                        className="mt-0.5 block font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {restaurant.email}
                      </a>
                    </div>
                  </li>
                )}

                {restaurant.website && (
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                      <Globe className="h-4.5 w-4.5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Website
                      </span>
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block truncate font-medium text-foreground transition-colors hover:text-primary"
                      >
                        Visit Website
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              <Separator className="my-6 opacity-40" />

              <Button
                asChild
                className="w-full btn-primary-modern rounded-xl py-6 font-semibold"
                disabled={!hasDirections}
              >
                <a
                  href={
                    restaurant.google_map_url ||
                    (restaurant.address
                      ? `https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`
                      : "#")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    !hasDirections ? "pointer-events-none opacity-50" : ""
                  }
                >
                  <MapPin className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Get Directions
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}