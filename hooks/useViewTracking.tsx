import { useEffect, useCallback } from "react";
import { useAuth } from "@/store/useAuth";
import { recordRecipeView, recordBlogView } from "@/utils/viewTracking";

/**
 * Hook to automatically track views when a component mounts
 * @param contentType - The type of content being viewed
 * @param contentId - The ID of the content
 * @param enabled - Whether view tracking is enabled (default: true)
 */
export function useViewTracking(
  contentType: "recipe" | "blog",
  contentId: number,
  enabled: boolean = true
) {
  const { user } = useAuth();

  const recordView = useCallback(async () => {
    if (!enabled || !contentId) return;

    try {
      // Use user ID directly as viewer_id (UUID string)
      const viewerId = user?.id || undefined;

      if (contentType === "recipe") {
        await recordRecipeView(contentId, viewerId);
      } else if (contentType === "blog") {
        await recordBlogView(contentId, viewerId);
      }
    } catch (error) {
      console.error("Error recording view:", error);
    }
  }, [contentType, contentId, enabled, user?.id]);

  // Record view when component mounts
  useEffect(() => {
    recordView();
  }, [recordView]);

  return { recordView };
}

/**
 * Hook to manually track views (useful for tracking views on specific actions)
 * @returns Function to record a view
 */
export function useManualViewTracking() {
  const { user } = useAuth();

  const recordView = useCallback(
    async (contentType: "recipe" | "blog", contentId: number) => {
      if (!contentId) return;

      try {
        // Use user ID directly as viewer_id (UUID string)
        const viewerId = user?.id || undefined;

        if (contentType === "recipe") {
          await recordRecipeView(contentId, viewerId);
        } else if (contentType === "blog") {
          await recordBlogView(contentId, viewerId);
        }
      } catch (error) {
        console.error("Error recording view:", error);
      }
    },
    [user?.id]
  );

  return { recordView };
}
