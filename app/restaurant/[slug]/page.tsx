import { getRestaurantBySlug } from "@/actions/restaurant/crud";
import { Header } from "@/components/header";
import Image from "next/image";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Mail,
  Image as ImageIcon,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FallbackImage } from "@/components/fallback-image";
import { BackButton } from "@/components/back-button";

export default async function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-strong text-lg">Restaurant not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6 md:mt-8">
        <div className="relative h-[25vh] md:h-[40vh] w-full overflow-hidden rounded-lg shadow-modern">
          {(restaurant as any).image?.url ? (
          <>
            <FallbackImage
              src={(restaurant as any).image.url}
              alt={restaurant.name || "Restaurant"}
              fill
              className="object-cover z-0"
              priority
              unoptimized
            />
            {/* Simple Overlay */}
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/50 via-black/20 to-transparent pointer-events-none"></div>
          </>
        ) : (
          <div className="absolute inset-0 z-0 bg-muted"></div>
        )}

        {/* Back Button */}
        <BackButton href="/restaurant" className="absolute top-4 left-4 md:top-6 md:left-6 z-30" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
          <div className="flex flex-col gap-3">
            {/* Category Handling */}
            <div className="flex flex-wrap gap-2">
              {(restaurant as any).category ? (
                Array.isArray((restaurant as any).category) ? (
                  (restaurant as any).category.map((cat: any) => (
                    <Badge
                      key={cat.id || cat.name || cat}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-sm"
                    >
                      {cat.name || cat}
                    </Badge>
                  ))
                ) : (
                  <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-sm">
                    {typeof (restaurant as any).category === "object"
                      ? ((restaurant as any).category as any).name
                      : (restaurant as any).category}
                  </Badge>
                )
              ) : null}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
              {restaurant.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base font-medium">
              {restaurant.rating !== null &&
                restaurant.rating !== undefined && (
                  <div className="flex items-center gap-1.5 drop-shadow-sm">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                    <span>{Number(restaurant.rating).toFixed(1)}</span>
                    {(restaurant as any).review ? (
                      <span className="text-white/70 ml-1">
                        ({(restaurant as any).review} reviews)
                      </span>
                    ) : null}
                  </div>
                )}

              {restaurant.address && (
                <div className="flex items-center gap-1.5 drop-shadow-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{restaurant.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8 md:pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Menu */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          {restaurant.description && (
            <section className="min-h-25">
              <h2 className="heading-secondary text-2xl mb-4 text-primary-strong">
                About
              </h2>
              <p className="text-body text-lg leading-relaxed">
                {restaurant.description}
              </p>
            </section>
          )}

          {/* Cuisines Section */}
          {restaurant.cuisines && restaurant.cuisines.length > 0 && (
            <section className="min-h-25">
              <h2 className="heading-secondary text-2xl mb-4 text-primary-strong">
                Cuisines
              </h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisines.map((cuisine: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="px-4 py-1.5 text-sm bg-card text-secondary-strong shadow-sm rounded-xl"
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {(restaurant as any).gallery &&
            (restaurant as any).gallery.length > 0 && (
              <section className="min-h-50">
                <h2 className="heading-secondary text-2xl mb-4 text-primary-strong">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(restaurant as any).gallery.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-modern modern-card-hover cursor-pointer group"
                    >
                      <FallbackImage
                        src={img.url}
                        alt={`Gallery view ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Menu Section */}
          {restaurant.menu && restaurant.menu.length > 0 && (
            <section className="min-h-75">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-secondary text-2xl text-primary-strong">
                  Menu Highlights
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menu.map((item: any, idx: number) => (
                  <Card
                    key={idx}
                    className="shadow-modern border-border/40 modern-card-hover rounded-lg group overflow-hidden"
                  >
                    <CardContent className="p-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="text-primary-strong text-lg group-hover:text-primary transition-colors font-semibold">
                            {item.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 whitespace-nowrap"
                          >
                            {item.price?.amount} {item.price?.currency}
                          </Badge>
                        </div>
                        {item.description ? (
                          <p className="text-muted-foreground text-sm line-clamp-3 mt-2 leading-relaxed">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Info Card */}
        <div className="space-y-6">
          <Card className="rounded-lg sticky top-24 shadow-modern border-border/50">
            <CardContent className="p-6">
              <h3 className="heading-secondary text-xl mb-4 text-primary-strong">
                Info & Contact
              </h3>
              <Separator className="mb-6 opacity-50" />

              <ul className="space-y-6">
                {restaurant.address && (
                  <li className="flex items-start gap-4 text-secondary-strong group">
                    <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="mt-1">
                      <span className="block font-medium">
                        {restaurant.address}
                      </span>
                      {(restaurant.city || restaurant.country) && (
                        <span className="text-sm text-muted-foreground mt-0.5 block">
                          {[restaurant.city, restaurant.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                    </div>
                  </li>
                )}

                {restaurant.phone && (
                  <li className="flex items-start gap-4 text-secondary-strong group">
                    <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="mt-1.5">
                      <span className="font-medium">{restaurant.phone}</span>
                    </div>
                  </li>
                )}

                {restaurant.email && (
                  <li className="flex items-start gap-4 text-secondary-strong group">
                    <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="mt-1.5 select-all">
                      <a
                        href={`mailto:${restaurant.email}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {restaurant.email}
                      </a>
                    </div>
                  </li>
                )}

                {restaurant.website && (
                  <li className="flex items-start gap-4 text-secondary-strong group">
                    <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div className="mt-1.5 overflow-hidden">
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary transition-colors truncate block"
                      >
                        Visit Website
                      </a>
                    </div>
                  </li>
                )}
              </ul>

              <Separator className="my-6 opacity-50" />

              <Button
                asChild
                className="w-full btn-primary-modern rounded-xl py-6 shadow-modern font-semibold"
                disabled={!restaurant.google_map_url && !restaurant.address}
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
                    !restaurant.google_map_url && !restaurant.address
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="h-20"></div>
    </div>
  );
}
