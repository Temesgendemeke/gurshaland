import { UseFormReturn } from "react-hook-form";
import {
  IconMapPin as MapPin,
  IconPhone as Phone,
  IconMail as Mail,
  IconGlobe as Globe,
  IconToolsKitchen2 as Utensils,
} from "@tabler/icons-react";
import { FallbackImage } from "@/components/fallback-image";
import { Separator } from "@/components/ui/separator";
import { normalizeImageUrl } from "@/lib/utils";

const PreviewSection = ({
  form,
}: {
  form: UseFormReturn<any>;
}) => {
  const menuItems = form.watch("menu") || [];
  const rawImage = form.watch("image");
  const name = form.watch("name");
  const cuisine = form.watch("cuisines") || [];
  const description = form.watch("description");
  const address = form.watch("address");
  const phone = form.watch("phone");
  const email = form.watch("email");
  const website = form.watch("website");
  const googleMapUrl = form.watch("google_map_url");
  const gallery = form.watch("gallery") || [];

  // Safely extract and normalize the cover image URL
  const coverImage = normalizeImageUrl(
    rawImage?.url ||
      (rawImage?.file instanceof File ? URL.createObjectURL(rawImage.file) : null) ||
      rawImage,
  );

  const activeCuisines = (cuisine || []).filter(
    (c: string) => typeof c === "string" && c.trim().length > 0,
  );
  const validMenuItems = (menuItems || []).filter(
    (item: any) => item?.name && item.name.trim().length > 0,
  );
  const validGallery = (gallery || [])
    .map((g: any) => ({
      ...g,
      normalizedUrl: normalizeImageUrl(g?.url || g),
    }))
    .filter((g: any) => Boolean(g.normalizedUrl));

  return (
    <div className="flex flex-col text-card-foreground text-sm">
      {/* Cover Image Area */}
      <div className="relative h-44 w-full overflow-hidden bg-muted/40">
        {coverImage ? (
          <FallbackImage
            src={coverImage}
            alt={name || "Restaurant Cover"}
            fill
            unoptimized
            className="object-cover"
            fallbackText="Cover image"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground/50">
            <Utensils className="h-8 w-8 mb-1.5 opacity-40" strokeWidth={1.5} />
            <span className="text-xs font-medium">Cover photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-md bg-background/90 px-2 py-0.5 text-[0.6875rem] font-medium text-foreground backdrop-blur-sm border border-border/60">
            Public Card
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Name & Cuisines */}
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {name?.trim() || "Restaurant Name"}
          </h3>

          {activeCuisines.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeCuisines.map((c: string, i: number) => (
                <span
                  key={i}
                  className="rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Add cuisines to display tags here
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {description?.trim() ||
            "A short introduction to your restaurant, ambiance, and specialty cuisine will appear here."}
        </p>

        <Separator />

        {/* Contact Info List */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
            <span className="truncate text-foreground/90">
              {address?.trim() || "Address not provided yet"}
            </span>
          </div>

          {phone?.trim() && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0 text-foreground/70" strokeWidth={1.5} />
              <span className="truncate text-foreground/90">{phone}</span>
            </div>
          )}

          {email?.trim() && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-foreground/70" strokeWidth={1.5} />
              <span className="truncate text-foreground/90">{email}</span>
            </div>
          )}

          {website?.trim() && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Globe className="h-4 w-4 shrink-0 text-foreground/70" strokeWidth={1.5} />
              <span className="truncate text-foreground/90">{website}</span>
            </div>
          )}

          {googleMapUrl?.trim() && (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <span className="text-primary font-medium">Mapped location attached</span>
            </div>
          )}
        </div>

        {/* Menu Highlights Preview */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Menu Highlights</span>
            <span className="text-muted-foreground">
              {validMenuItems.length} {validMenuItems.length === 1 ? "dish" : "dishes"}
            </span>
          </div>

          {validMenuItems.length > 0 ? (
            <div className="space-y-2 divide-y divide-border/40">
              {validMenuItems.slice(0, 4).map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between gap-2 pt-2 first:pt-0">
                  <div className="min-w-0">
                    <p className="font-medium text-xs text-foreground truncate">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-[0.6875rem] text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-foreground">
                    {item.price?.amount
                      ? `${item.price.amount} ${item.price.currency || "ETB"}`
                      : "—"}
                  </span>
                </div>
              ))}
              {validMenuItems.length > 4 && (
                <p className="text-[0.6875rem] text-muted-foreground text-center pt-1.5">
                  +{validMenuItems.length - 4} more items on public profile
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border/80 p-3 text-center text-xs text-muted-foreground">
              Menu dishes will preview here
            </div>
          )}
        </div>

        {/* Gallery Preview */}
        {validGallery.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Gallery</span>
              <span className="text-muted-foreground">
                {validGallery.length} {validGallery.length === 1 ? "photo" : "photos"}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {validGallery.slice(0, 4).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-md border border-border/60 bg-muted/30"
                >
                  <FallbackImage
                    src={item.normalizedUrl}
                    alt={`Photo ${idx + 1}`}
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
