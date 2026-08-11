"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import RestaurantForm from "./RestaurantForm";
import { getRestaurentSchema, GetRestaurentType } from "@/schema/restaurent";
import { useForm } from "react-hook-form";
import PreviewSection from "./PreviewSection";
import { toast } from "sonner";
import generate_error from "@/utils/generate_error";
import { updateRestaurant } from "@/actions/restaurant/crud";
import { useRouter } from "next/navigation";
import { IconMapPin as MapPin } from "@tabler/icons-react";

const EditRestaurantForm = ({
  restaurant,
}: {
  restaurant: GetRestaurentType;
}) => {
  const router = useRouter();

  const form = useForm<GetRestaurentType>({
    resolver: zodResolver(getRestaurentSchema),
    defaultValues: {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant?.address || "",
      phone: restaurant?.phone || "",
      email: restaurant?.email || "",
      website: restaurant?.website || "",
      cuisines: restaurant?.cuisines || [],
      description: restaurant?.description || "",
      image: {
        id: restaurant?.image?.id || "",
        url: restaurant?.image?.url || "",
        path: restaurant?.image?.path || "",
        file: restaurant?.image?.file || "",
      },
      google_map_url: restaurant?.google_map_url || "",
      menu: restaurant?.menu || [],
      gallery: restaurant?.gallery || [],
      reviews: restaurant?.reviews || [],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const restaurant = await updateRestaurant(data);
      toast.success("Restaurant updated successfully");
      if (restaurant?.slug) {
        router.push(`/restaurant/${restaurant?.slug}`);
      }
    } catch (error) {
      toast.error(generate_error(error));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full bg-background text-card-foreground max-w-7xl mx-auto px-4 md:px-8 mt-8 md:mt-10">
      <div className="lg:col-span-7">
        <RestaurantForm form={form} onSubmit={onSubmit} mode="edit" />
      </div>
      <div className="hidden lg:block lg:col-span-5 relative">
        <div className="sticky top-24 space-y-6">
          <h2 className="font-gosh text-xl font-bold tracking-tight text-foreground">
            Live Preview
          </h2>

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_25px_60px_-30px_hsl(var(--foreground)/0.15)]">
            <PreviewSection form={form} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurantForm;
