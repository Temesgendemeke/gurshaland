"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconMapPin as MapPin, IconStar as Star } from "@tabler/icons-react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { GetRestaurentType } from "@/schema/restaurent";
import { useReducedMotion } from "motion/react";
import { useAuth } from "@/store/useAuth";
import { deleteRestaurant } from "@/actions/restaurant/crud";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RestaurantCard = ({ restaurant }: { restaurant: GetRestaurentType }) => {
  const router = useRouter();
  const user = useAuth((store) => store.user);
  const reduceMotion = useReducedMotion();
  const [imageSrc, setImageSrc] = useState(
    restaurant?.image?.url || "/placeholder.svg",
  );
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const cleanSlug = (restaurant.slug ?? restaurant.id ?? "").toString().split("?")[0];

  const isOwner = Boolean(
    user?.id && (
      user.id === restaurant.author_id ||
      user.id === (restaurant as any).author?.id ||
      user.id === (restaurant as any).user_id
    )
  );

  const correctUrl = (url: string) => {
    if (url.includes("https://static.playfood.com/")) {
      return url.replace(/\.com\/\//g, ".com/");
    }
    if (!url) {
      return "/placeholder.svg";
    }
    return url;
  };

  const location = restaurant.city || restaurant.address || "Addis Ababa";
  const primaryCuisine = restaurant.cuisines?.[0];

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/restaurant/edit/${cleanSlug}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!restaurant.id) return;
    try {
      setDeleting(true);
      await deleteRestaurant(restaurant.id);
      toast.success("Restaurant deleted successfully");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete restaurant");
      setDeleting(false);
    }
  };

  return (
    <div className="relative h-full">
      <Link
        href={`/restaurant/${cleanSlug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-colors duration-200 hover:border-foreground/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
        aria-label={`View ${restaurant.name}`}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={correctUrl(imageSrc)}
            alt={restaurant.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${
              reduceMotion ? "" : "group-hover:scale-[1.025]"
            }`}
            onError={() => setImageSrc("/placeholder.svg")}
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="truncate">{primaryCuisine || "Restaurant"}</span>
            {restaurant.rating !== null && restaurant.rating !== undefined && (
              <span className="inline-flex shrink-0 items-center gap-1 text-foreground normal-case tracking-normal">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" strokeWidth={1.5} />
                {Number(restaurant.rating).toFixed(1)}
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 font-gosh text-xl font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
            {restaurant.name}
          </h3>

          {restaurant.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {restaurant.description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-1.5 pt-4 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary/80" strokeWidth={1.5} />
            <span className="truncate text-sm font-medium">
              {location.length > 34 ? location.slice(0, 34) + "…" : location}
            </span>
          </div>
        </div>
      </Link>

      {/* Owner Options Menu */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-background text-foreground"
                aria-label="Restaurant options"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-background">
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer font-medium"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="cursor-pointer font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{restaurant.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              onClick={(e) => e.stopPropagation()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RestaurantCard;
