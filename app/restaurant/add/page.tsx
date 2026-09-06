"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Header } from "@/components/header";
import { IconMapPin as MapPin } from "@tabler/icons-react";
import PreviewSection from "@/components/restaurant/PreviewSection";
import restaurantSchema, {
  GetRestaurentType,
} from "@/schema/restaurent";
import { useState } from "react";
import RestaurantForm from "@/components/restaurant/RestaurantForm";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";
import { useRouter } from "next/navigation";
import { createRestaurant } from "@/actions/restaurant/crud";
import { generateUniqueSlug } from "@/utils/slugify";

type FormValues = z.infer<typeof restaurantSchema>;

const AddRestaurantPage = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(restaurantSchema) as any,
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      cuisines: [],
      description: "",
      image: undefined,
      google_map_url: "",
      menu: [],
      gallery: [],
      reviews: [],
    },
  });

  const onSubmit = async (data: GetRestaurentType) => {
    try {
      const sanitizedCuisines = Array.isArray(data.cuisines)
        ? data.cuisines.filter((c) => typeof c === "string" && c.trim().length > 0)
        : [];
      const restaurantData = {
        ...data,
        cuisines: sanitizedCuisines,
        slug: await generateUniqueSlug(data.name, "restaurant"),
      };
      const restaurant = await createRestaurant(restaurantData);
      toast.success("Restaurant created successfully");
      if (restaurant?.slug) {
        router.push(`/restaurant/${restaurant?.slug}`);
      }
    } catch (error) {
      toast.error(generate_error(error));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="mb-10 mx-auto max-w-2xl text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Add a New Spot
          </span>
          <h1 className="mt-4 font-gosh text-4xl font-extrabold tracking-tight md:text-5xl">
            Add New <span className="text-primary">Restaurant</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Share your culinary haven with the world. Fill in the details below
            to create your restaurant profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <RestaurantForm form={form} onSubmit={onSubmit} />
          </div>

          {/* Right Column: Preview */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              <h2 className="font-gosh text-xl font-bold tracking-tight text-foreground">
                Live Preview
              </h2>

              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <PreviewSection form={form} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddRestaurantPage;