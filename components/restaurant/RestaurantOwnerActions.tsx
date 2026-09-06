"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRestaurant } from "@/actions/restaurant/crud";
import { toast } from "sonner";
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

export default function RestaurantOwnerActions({
  restaurantId,
  slug,
  name,
}: {
  restaurantId: string | number;
  slug: string;
  name: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    router.push(`/restaurant/edit/${slug}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteRestaurant(restaurantId);
      toast.success("Restaurant deleted successfully");
      setShowDeleteDialog(false);
      router.push("/restaurant");
    } catch (error) {
      toast.error("Failed to delete restaurant");
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 sm:h-8 sm:w-auto p-0 sm:px-2.5 gap-1.5 text-xs font-medium border-border hover:bg-muted/40 transition-colors shadow-none shrink-0"
          onClick={handleEdit}
          title="Edit Spot"
          aria-label="Edit Spot"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">Edit Spot</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 sm:h-8 sm:w-auto p-0 sm:px-2.5 gap-1.5 text-xs font-medium border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-colors shadow-none shrink-0"
          onClick={() => setShowDeleteDialog(true)}
          title="Delete Spot"
          aria-label="Delete Spot"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
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
    </>
  );
}
