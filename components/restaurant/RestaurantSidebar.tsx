import React from "react";
import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantSidebarProps {
  name: string;
  address?: string;
  mapsUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  country?: string;
}

export default function RestaurantSidebar({
  name,
  address,
  mapsUrl,
  phone,
  email,
  website,
  city,
  country,
}: RestaurantSidebarProps) {
  const hasContactInfo = Boolean(address || phone || email || website || city || country);

  if (!hasContactInfo) return null;

  const displayWebsite = website
    ? website.replace(/^https?:\/\//i, "").replace(/\/$/, "")
    : "";

  return (
    <aside className="space-y-4 sm:space-y-5">
      {/* Location & Contact Card */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-none space-y-4 sm:space-y-5">
        <h3 className="font-gosh text-base sm:text-lg font-bold tracking-tight text-foreground border-b border-border/70 pb-3">
          Location & Contact
        </h3>

        {/* Physical Address */}
        {address && (
          <div className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="space-y-0.5 leading-snug">
              <p className="font-medium">{address}</p>
              {(city || country) && (
                <p className="text-muted-foreground text-xs">
                  {[city, country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Get Directions Button */}
        {mapsUrl && (
          <Button
            asChild
            variant="outline"
            className="w-full justify-center gap-2 border-border text-xs sm:text-sm font-medium h-10 shadow-none hover:bg-muted/40"
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
              <span>Get Directions</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
            </a>
          </Button>
        )}

        {/* Contact Links */}
        <div className="space-y-2.5 pt-1 border-t border-border/60">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group py-1"
            >
              <Phone className="h-4 w-4 text-primary/80 group-hover:text-primary shrink-0 transition-colors" strokeWidth={1.5} />
              <span className="font-mono">{phone}</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group py-1 truncate"
            >
              <Mail className="h-4 w-4 text-primary/80 group-hover:text-primary shrink-0 transition-colors" strokeWidth={1.5} />
              <span className="truncate">{email}</span>
            </a>
          )}

          {website && (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors group py-1"
            >
              <Globe className="h-4 w-4 text-primary/80 group-hover:text-primary shrink-0 transition-colors" strokeWidth={1.5} />
              <span className="truncate font-medium text-foreground underline-offset-4 group-hover:underline">
                {displayWebsite || "Official Website"}
              </span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/60 group-hover:text-foreground" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
