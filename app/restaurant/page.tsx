"use client";
import BackNavigation from "@/components/BackNavigation";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
// import { searchSchema } from "@/schema/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { IceCream, LocateIcon, Map, MapPin, Search, StarIcon, StarsIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { Restaurant } from "@/utils/types/restaurant";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term"),
});

const page = () => {
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data) => {
    console.log(data);
  };

  const restaurants: Restaurant[] = [
    {
      id: "r001",
      slug: "saffron-and-spice",
      name: "Saffron & Spice",
      description:
        "Modern Indian fare with bold flavors, craft cocktails, and a cozy urban vibe.",
      location: "San Francisco, CA",
      city: "San Francisco",
      rating: 4.6,
      image_url: "https://images.unsplash.com/photo-1543353071-873f17a7a5c0",
    },
    {
      id: "r002",
      slug: "trattoria-bella",
      name: "Trattoria Bella",
      description:
        "Classic Italian trattoria serving handmade pasta, wood-fired pizzas, and fine wines.",
      location: "New York, NY",
      city: "New York",
      rating: 4.7,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947",
    },
    {
      id: "r003",
      slug: "umami-house",
      name: "Umami House",
      description:
        "Sleek Japanese dining with premium sushi, seasonal omakase, and sake pairings.",
      location: "Seattle, WA",
      city: "Seattle",
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    },
    {
      id: "r004",
      slug: "el-patio-verde",
      name: "El Patio Verde",
      description:
        "Fresh, vibrant Mexican plates and street-style tacos in a garden patio setting.",
      location: "Austin, TX",
      city: "Austin",
      rating: 4.5,
      image_url: "https://images.unsplash.com/photo-1604908176997-431652c5e8bb",
    },
    {
      id: "r005",
      slug: "le-petit-marche",
      name: "Le Petit Marché",
      description:
        "Charming French bistro offering classic dishes, pastries, and curated cheeses.",
      location: "Chicago, IL",
      city: "Chicago",
      rating: 4.4,
      image_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    },
    {
      id: "r006",
      slug: "kebab-kontempera",
      name: "Kebab Kontemporā",
      description:
        "Contemporary Middle Eastern grill with aromatic kebabs and mezze platters.",
      location: "Los Angeles, CA",
      city: "Los Angeles",
      rating: 4.3,
      image_url: "https://images.unsplash.com/photo-1604908554231-6134d0dfc579",
    },
    {
      id: "r007",
      slug: "bambu-garden",
      name: "Bambu Garden",
      description:
        "Light, herb-forward Vietnamese cuisine featuring pho, bun bowls, and fresh rolls.",
      location: "Portland, OR",
      city: "Portland",
      rating: 4.5,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947",
    },
    {
      id: "r008",
      slug: "taste-of-kerala",
      name: "Taste of Kerala",
      description:
        "Authentic Kerala specialties with rich spices, seafood curries, and dosas.",
      location: "Houston, TX",
      city: "Houston",
      rating: 4.6,
      image_url: "https://images.unsplash.com/photo-1565895405139-0a3b2f9b3cfe",
    },
    {
      id: "r009",
      slug: "the-green-fork",
      name: "The Green Fork",
      description:
        "Creative plant-based menu with seasonal produce and nourishing bowls.",
      location: "Denver, CO",
      city: "Denver",
      rating: 4.2,
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    },
    {
      id: "r010",
      slug: "seaside-grill",
      name: "Seaside Grill",
      description:
        "Coastal seafood spot known for fresh catches, tropical flavors, and ocean views.",
      location: "Miami, FL",
      city: "Miami",
      rating: 4.3,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947",
    },
  ];

  return (
    <>
      <Header />

      <div>
        <BackNavigation />

        {/* hero text */}
        <div>
          <div className="py-16 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              The Hottest Lounge Search Engine
            </h1>

            <div className="max-w-6xl mx-auto mt-10 px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-xl shadow-lg border border-border/50"
                >
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Search for a lounge..."
                            className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* <div className="md:w-64">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Location"
                            className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
                          />
                        </div>
                      )}
                    />
                  </div>

                  <div className="md:w-32">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <div className="relative">
                          <StarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Rating"
                            type="number"
                            min={0}
                            max={5}
                            className="pl-10 bg-background border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
                          />
                        </div>
                      )}
                    />
                  </div> */}

                  <Button type="submit" className="md:w-auto px-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
                    <StarsIcon className="w-5 h-5"/>
                    <span>Search</span>
                  </Button>
                </form>
              </Form>

            </div>


            {JSON.stringify(form.watch("query"))}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-5 mt-10">

              {restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={`resturant-list-${index + 1}`}
                  restaurant={restaurant}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
