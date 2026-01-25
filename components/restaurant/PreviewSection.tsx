import { UseFormReturn, FieldValues } from "react-hook-form";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  UtensilsCrossed,
  Star,
  ChefHat,
  MapPinHouseIcon,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { GetRestaurentType, RestaurantFormType } from "@/schema/restaurent";

const PreviewSection = ({
  form,
}: {
  form: UseFormReturn<RestaurantFormType | GetRestaurentType>;
}) => {
  const menuItems = form.watch("menu") || [];
  const coverImage = form.watch("image")?.url || "/placeholder.svg";
  const name = form.watch("name");
  const cuisine = form.watch("cuisines");
  const description = form.watch("description");
  const address = form.watch("address");
  const phone = form.watch("phone");
  const email = form.watch("email");
  const website = form.watch("website");
  const gallery = form.watch("gallery");

  return (
    <div className="flex flex-col h-full bg-background  text-card-foreground">
      {/* Cover Image Area */}
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        {coverImage && coverImage !== "/placeholder.svg" ? (
          <Image
            src={coverImage}
            alt="Restaurant Cover"
            fill
            className="object-cover transition-transform hover:scale-105 duration-700"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary/30">
            <UtensilsCrossed className="h-12 w-12 mb-2 opacity-20" />
            <span className="text-sm font-medium opacity-50">Cover Image</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge
            variant="secondary"
            className="backdrop-blur-md bg-background/70 text-foreground border border-border/50"
          >
            Preview
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">
                {name || "Restaurant Name"}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">
                  {cuisine?.join(", ") || "Cuisine Type"}
                </span>
              </div>
            </div>
            <div className="flex gap-0.5 text-warning">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            About
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground/90">
            {description ||
              "A brief description of your restaurant will appear here. Share your story, atmosphere, and what makes your food special."}
          </p>
        </div>

        {/* Contact Details */}
        <div className="grid gap-3 p-4 bg-secondary/20 rounded-lg border border-border/50">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{address || "Address"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{phone || "Phone Number"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{email || "Email Address"}</span>
          </div>
          {website && (
            <Link
              href={website || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm"
            >
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate ">{website}</span>
            </Link>
          )}

          {form.watch("google_map_url") && (
            <Link
              href={form.watch("google_map_url") || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm"
            >
              <MapPinHouseIcon className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate ">Google map</span>
            </Link>
          )}
        </div>

        {/* Menu Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Menu Highlights
            </h3>
            <Badge variant="outline" className="text-xs font-normal">
              {menuItems.length} Items
            </Badge>
          </div>

          <ScrollArea className="h-[180px] w-full pr-4">
            {menuItems.length > 0 ? (
              <div className="space-y-3">
                {menuItems.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-start group p-2 rounded-md hover:bg-secondary/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {item.name || "Dish Name"}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.description || "Description..."}
                      </p>
                    </div>
                    <div className="font-semibold text-sm whitespace-nowrap pl-4">
                      {item.price.amount
                        ? `${item.price.amount} ${item.price.currency}`
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground border-2 border-dashed rounded-lg border-muted">
                <span className="text-xs">No menu items added</span>
              </div>
            )}
          </ScrollArea>

          {/* Gallery Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Gallery
              </h3>
              <Badge variant="outline" className="text-xs font-normal">
                {form.watch("gallery")?.length} Images
              </Badge>
            </div>
            {/* <ScrollArea className="h-[180px] w-full pr-4"> */}
            <div className="columns-2 gap-3 space-y-3">
              {form.watch("gallery")?.[0]?.url ? (
                form.watch("gallery")?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="break-inside-avoid mb-3 overflow-hidden rounded-lg border border-border/50 bg-muted/30"
                  >
                    <div className="relative w-full">
                      <Image
                        src={item?.url ? item?.url : "/placeholder.svg"}
                        width={200}
                        height={200}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-auto object-cover transition-all hover:scale-105 duration-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground border-2 border-dashed rounded-lg border-muted col-span-2 break-inside-avoid w-full">
                  <span className="text-xs">No gallery images added</span>
                </div>
              )}
            </div>

            {/* </ScrollArea> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
