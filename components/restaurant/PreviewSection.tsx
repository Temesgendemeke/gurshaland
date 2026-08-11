import { UseFormReturn } from "react-hook-form";
import {
  IconMapPin as MapPin,
  IconPhone as Phone,
  IconMail as Mail,
  IconGlobe as Globe,
  IconCooker as UtensilsCrossed,
  IconStar as Star,
  IconChefHat as ChefHat,
  IconPhoto as ImageIcon,
} from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const PreviewSection = ({
  form,
}: {
  form: UseFormReturn<any>;
}) => {
  const menuItems = form.watch("menu") || [];
  const coverImage = form.watch("image")?.url || "";
  const name = form.watch("name");
  const cuisine = form.watch("cuisines");
  const description = form.watch("description");
  const address = form.watch("address");
  const phone = form.watch("phone");
  const email = form.watch("email");
  const website = form.watch("website");
  const gallery = form.watch("gallery") || [];

  return (
    <div className="flex flex-col text-card-foreground">
      {/* Cover Image Area */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt="Restaurant Cover"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-secondary/20 text-muted-foreground">
            <UtensilsCrossed className="mb-2 h-10 w-10 opacity-20" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-wider opacity-50">
              Cover Image
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute right-3 top-3">
          <Badge className="border border-border bg-background/90 text-foreground backdrop-blur-sm">
            Preview
          </Badge>
        </div>
      </div>

      <div className="space-y-6 p-5">
        {/* Header Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-gosh text-2xl font-bold leading-tight tracking-tight">
              {name || "Restaurant Name"}
            </h2>
            {cuisine?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cuisine.filter(Boolean).map((c: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-border/70 bg-card px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex shrink-0 gap-0.5 text-secondary">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-current" strokeWidth={1.5} />
            ))}
          </div>
        </div>

        <Separator className="opacity-40" />

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            About
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground/90">
            {description ||
              "A brief description of your restaurant will appear here. Share your story, atmosphere, and what makes your food special."}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-4">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
            <span className="truncate text-foreground">
              {address || "Address"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
            <span className="truncate text-foreground">
              {phone || "Phone Number"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
            <span className="truncate text-foreground">
              {email || "Email Address"}
            </span>
          </div>
          {website && (
            <Link
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm"
            >
              <Globe className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="truncate text-foreground">{website}</span>
            </Link>
          )}
          {form.watch("google_map_url") && (
            <Link
              href={form.watch("google_map_url") || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm"
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="truncate text-foreground">
                Google Maps
              </span>
            </Link>
          )}
        </div>

        {/* Menu Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ChefHat className="h-4 w-4" strokeWidth={1.5} />
              Menu Highlights
            </h3>
            <Badge variant="outline" className="text-xs font-normal">
              {menuItems.length} {menuItems.length === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          {menuItems.length > 0 ? (
            <div className="space-y-1.5">
              {menuItems
                .filter((item: any) => item?.name)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-baseline gap-2 text-sm"
                  >
                    <span className="truncate font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="flex-1 border-b border-dashed border-border" />
                    <span className="shrink-0 font-semibold text-primary">
                      {item.price?.amount ? (
                        `${item.price.amount} ${item.price.currency}`
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
              No menu items added yet
            </div>
          )}
        </div>

        {/* Gallery Preview */}
        {gallery.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ImageIcon className="h-4 w-4" strokeWidth={1.5} />
                Gallery
              </h3>
              <Badge variant="outline" className="text-xs font-normal">
                {gallery.filter((g: any) => g?.url).length} Images
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {gallery
                .filter((g: any) => g?.url)
                .slice(0, 6)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted/30"
                  >
                    <Image
                      src={item.url}
                      alt={`Gallery ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
