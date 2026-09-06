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

const EditRestaurantForm = ({
  restaurant,
}: {
  restaurant: GetRestaurentType;
}) => {
  const router = useRouter();

  const resolveInitialImage = (img: any) => {
    if (!img) return { id: "", url: "", path: "", file: "" };
    if (typeof img === "string") return { id: "", url: img, path: "", file: "" };
    return {
      id: img.id || "",
      url: img.url || "",
      path: img.path || "",
      file: img.file || "",
    };
  };

  const resolveInitialGallery = (gallery: any) => {
    if (!Array.isArray(gallery)) return [];
    return gallery.map((item) => {
      if (typeof item === "string") return { id: "", url: item, path: "", file: "" };
      return {
        id: item?.id || "",
        url: item?.url || "",
        path: item?.path || "",
        file: item?.file || "",
      };
    });
  };

  const form = useForm<GetRestaurentType>({
    resolver: zodResolver(getRestaurentSchema) as any,
    defaultValues: {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant?.address || "",
      phone: restaurant?.phone || "",
      email: restaurant?.email || "",
      website: restaurant?.website || "",
      cuisines: restaurant?.cuisines || [],
      description: restaurant?.description || "",
      image: resolveInitialImage(restaurant?.image),
      google_map_url: restaurant?.google_map_url || "",
      menu: restaurant?.menu || [],
      gallery: resolveInitialGallery(restaurant?.gallery),
      reviews: restaurant?.reviews || [],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const sanitizedCuisines = Array.isArray(data.cuisines)
        ? data.cuisines.filter((c: any) => typeof c === "string" && c.trim().length > 0)
        : [];
      const payload = {
        ...data,
        cuisines: sanitizedCuisines,
      };
      const updated = await updateRestaurant(payload);
      toast.success("Restaurant profile updated successfully");
      if (updated?.slug) {
        router.push(`/restaurant/${updated.slug}`);
      }
      router.back();
    } catch (error) {
      toast.error(generate_error(error));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7">
        <RestaurantForm
          form={form}
          onSubmit={onSubmit}
          mode="edit"
          cancelHref={`/restaurant/${restaurant.slug}`}
        />
      </div>

      <div className="hidden lg:block lg:col-span-5 relative">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Storefront Preview
              </span>
            </div>
            <span className="text-xs text-muted-foreground/70">
              Matches public layout
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <PreviewSection form={form} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurantForm;
