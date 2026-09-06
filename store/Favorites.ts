import Recipe from "@/utils/types/recipe";
import { Blog } from "@/utils/types/blog";
import { create } from "zustand";
import { getBookmarkedRecipes } from "@/actions/Recipe/bookmark";
import { getBookmarkedBlogs } from "@/actions/blog/bookmark";

interface FavoritesStore {
  recipes: Recipe[];
  blogs: Blog[];
  loading: boolean;
  blogsLoading: boolean;
  fetched: boolean;
  blogsFetched: boolean;
  fetchBookmarks: (user_id: string) => Promise<void>;
  fetchBlogBookmarks: (user_id: string, force?: boolean) => Promise<void>;
  removeBookmark: (recipe_id: string) => void;
  removeBlogBookmark: (blog_id: string | number) => void;
  addBlogBookmark: (blog: Blog) => void;
}

export const favoritesStore = create<FavoritesStore>((set, get) => ({
  recipes: [],
  blogs: [],
  loading: false,
  blogsLoading: false,
  fetched: false,
  blogsFetched: false,
  fetchBookmarks: async (user_id: string) => {
    if (get().fetched) return;
    set({ loading: true });
    try {
      const recipes = await getBookmarkedRecipes(user_id);
      set({ recipes, loading: false, fetched: true });
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
      set({ loading: false, fetched: true });
    }
  },
  fetchBlogBookmarks: async (user_id: string, force = false) => {
    if (get().blogsFetched && !force) return;
    set({ blogsLoading: true });
    try {
      const blogs = await getBookmarkedBlogs(user_id);
      set({ blogs, blogsLoading: false, blogsFetched: true });
    } catch (error) {
      console.error("Failed to fetch blog bookmarks:", error);
      set({ blogsLoading: false, blogsFetched: true });
    }
  },
  removeBookmark: (recipe_id: string) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== recipe_id),
    })),
  removeBlogBookmark: (blog_id: string | number) =>
    set((state) => ({
      blogs: state.blogs.filter((b) => b.id !== blog_id && String(b.id) !== String(blog_id)),
    })),
  addBlogBookmark: (blog: Blog) =>
    set((state) => ({
      blogs: state.blogs.some((b) => b.id === blog.id) ? state.blogs : [blog, ...state.blogs],
    })),
}));
