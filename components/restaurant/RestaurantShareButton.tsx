"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RestaurantShareButton({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${name} | Gurshaland`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleShare}
      title={copied ? "Copied" : "Share Spot"}
      aria-label="Share Spot"
      className={cn(
        "h-7 w-7 sm:h-8 sm:w-auto p-0 sm:px-2.5 gap-1.5 text-xs font-medium border-border hover:bg-muted/40 transition-colors shadow-none shrink-0",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">{copied ? "Copied" : "Share Spot"}</span>
    </Button>
  );
}
