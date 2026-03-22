"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  UtensilsCrossed,
  ImageIcon,
  Save,
  FileWarning,
  MessageCircleWarningIcon,
  CircleAlert,
  X,
  Trash,
  Loader2,
} from "lucide-react";
import ImageBox from "@/components/ImageBox";
import PreviewSection from "@/components/restaurant/PreviewSection";
import restaurantSchema, {
  GetRestaurentType,
  RestaurantFormType,
} from "@/schema/restaurent";
import MenuInputSection from "@/components/restaurant/MenuInputSection";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    resolver: zodResolver(restaurantSchema),
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
      const restaurantData = {
        ...data,
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-[calc(100%-1rem)] max-w-7xl px-6 py-8 md:py-12">
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold ">
            Add New Restaurant
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Live Preview
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="bg-card rounded-2xl  border border-border overflow-hidden">
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
