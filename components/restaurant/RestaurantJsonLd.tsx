import React from "react";
import type { GetRestaurentType } from "@/schema/restaurent";

interface RestaurantJsonLdProps {
  restaurant: GetRestaurentType & {
    city?: string;
    country?: string;
    rating?: number | null;
    review?: any;
  };
}

export default function RestaurantJsonLd({ restaurant }: RestaurantJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
  };

  if (restaurant.description) jsonLd.description = restaurant.description;
  if (restaurant.image?.url) jsonLd.image = restaurant.image.url;
  if (restaurant.cuisines?.length) jsonLd.servesCuisine = restaurant.cuisines;
  if (restaurant.phone) jsonLd.telephone = restaurant.phone;
  if (restaurant.email) jsonLd.email = restaurant.email;
  if (restaurant.google_map_url) jsonLd.hasMap = restaurant.google_map_url;
  if (restaurant.website) jsonLd.sameAs = restaurant.website;

  if (restaurant.address || restaurant.city || restaurant.country) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: restaurant.address || undefined,
      addressLocality: restaurant.city || undefined,
      addressCountry: restaurant.country || undefined,
    };
  }

  const rating = restaurant.rating;
  const reviewCount = Array.isArray(restaurant.review)
    ? restaurant.review.length
    : Number(restaurant.review) || 0;

  if (rating != null && reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(rating).toFixed(1),
      reviewCount,
    };
  }

  const menuItems = (restaurant.menu ?? [])
    .filter((item: any) => item.price?.amount != null)
    .map((item: any) => ({
      "@type": "MenuItem",
      name: item.name,
      description: item.description || undefined,
      offers: {
        "@type": "Offer",
        price: Number(item.price.amount),
        priceCurrency: item.price.currency || "ETB",
      },
    }));

  if (menuItems.length > 0) {
    jsonLd.hasMenu = {
      "@type": "Menu",
      hasMenuSection: {
        "@type": "MenuSection",
        hasMenuItem: menuItems,
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
