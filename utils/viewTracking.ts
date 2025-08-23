import { createClient } from '@/lib/supabase-client';

const supabase = createClient();

/**
 * Record a view for a recipe
 * @param recipeId - The ID of the recipe being viewed
 * @param viewer_id - Optional viewer ID if the viewer is authenticated
 * @param ipAddress - Optional IP address (can be captured from request headers)
 * @param userAgent - Optional user agent string
 * @returns Promise<boolean> - true if view was recorded, false if duplicate
 */
export async function recordRecipeView(
  recipeId: number,
  viewer_id?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('record_recipe_view', {
      _recipe_id: recipeId,
      _viewer_id: viewer_id || null,
      _ip_address: ipAddress || null,
      _user_agent: userAgent || null
    });

    if (error) {
      console.error('Error recording recipe view:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error recording recipe view:', error);
    return false;
  }
}

/**
 * Record a view for a blog
 * @param blogId - The ID of the blog being viewed
 * @param viewer_id - Optional viewer ID if the viewer is authenticated
 * @param ipAddress - Optional IP address (can be captured from request headers)
 * @param userAgent - Optional user agent string
 * @returns Promise<boolean> - true if view was recorded, false if duplicate
 */
export async function recordBlogView(
  blogId: number,
  viewer_id?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('record_blog_view', {
      _blog_id: blogId,
      _viewer_id: viewer_id || null,
      _ip_address: ipAddress || null,
      _user_agent: userAgent || null
    });

    if (error) {
      console.error('Error recording blog view:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error recording blog view:', error);
    return false;
  }
}

/**
 * Get view count for a recipe
 * @param recipeId - The ID of the recipe
 * @returns Promise<number> - The number of views
 */
export async function getRecipeViewCount(recipeId: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('recipe_view')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId);

    if (error) {
      console.error('Error getting recipe view count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting recipe view count:', error);
    return 0;
  }
}

/**
 * Get view count for a blog
 * @param blogId - The ID of the blog
 * @returns Promise<number> - The number of views
 */
export async function getBlogViewCount(blogId: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('blog_view')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', blogId);

    if (error) {
      console.error('Error getting blog view count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting blog view count:', error);
    return 0;
  }
}

/**
 * Hook to automatically record views when a component mounts
 * This can be used in React components to track views
 */
export function useViewTracking() {
  const recordView = async (
    contentType: 'recipe' | 'blog',
    contentId: number,
    viewer_id?: string
  ) => {
    if (typeof window === 'undefined') return; // Server-side rendering

    const userAgent = navigator.userAgent;
    
    if (contentType === 'recipe') {
      await recordRecipeView(contentId, viewer_id, undefined, userAgent);
    } else if (contentType === 'blog') {
      await recordBlogView(contentId, viewer_id, undefined, userAgent);
    }
  };

  return { recordView };
} 