"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import BlogPostCard from "@/components/BlogPostCard";
import FeaturedPost from "@/components/FeaturedPost";
import categories from "@/constants/categories";
import { blogStore } from "@/store/Blog";
import { Skeleton } from "@/components/ui/skeleton";
import BlogPostPage from "./[slug]/page";
import BlogPageSkeleton from "@/components/skeleton/BlogPageSkeleton";

// const blogPosts = [
//   {
//     id: 1,
//     title: "The Art of Making Perfect Injera at Home",
//     subtitle:
//       "Master the traditional Ethiopian flatbread with our comprehensive guide, including tips for fermentation and cooking techniques.",
//     author: "Chef Almaz Tadesse",
//     created_at: "March 20, 2024",
//     read_time: "8 min read",
//     category: "Recipes",
//     image: "/placeholder.svg?height=200&width=300",
//     featured: true,
//     tags: ["Injera", "Traditional", "Baking"],
//   },
//   {
//     id: 2,
//     title: "Berbere Spice Blend: The Heart of Ethiopian Cuisine",
//     subtitle:
//       "Discover the complex flavors and history behind Ethiopia's most important spice blend, plus a traditional recipe.",
//     author: "Dr. Kebede Alemu",
//     created_at: "March 18, 2024",
//     read_time: "6 min read",
//     category: "Culture",
//     image: "/placeholder.svg?height=200&width=300",
//     featured: false,
//     tags: ["Berbere", "Spices", "History"],
//   },
//   {
//     id: 3,
//     title: "Vegetarian Ethiopian Dishes for Lent",
//     subtitle:
//       "Explore the rich tradition of Ethiopian fasting foods with these delicious plant-based recipes perfect for any season.",
//     author: "Hanan Mohammed",
//     created_at: "March 15, 2024",
//     read_time: "10 min read",
//     category: "Recipes",
//     image: "/placeholder.svg?height=200&width=300",
//     featured: false,
//     tags: ["Vegetarian", "Fasting", "Lent"],
//   },
//   {
//     id: 4,
//     title: "Coffee Culture: From Bean to Cup in Ethiopia",
//     subtitle:
//       "Journey through Ethiopia's coffee regions and learn about the traditional coffee ceremony that brings communities together.",
//     author: "Dawit Bekele",
//     created_at: "March 12, 2024",
//     read_time: "12 min read",
//     category: "Culture",
//     image: "/placeholder.svg?height=200&width=300",
//     featured: false,
//     tags: ["Coffee", "Ceremony", "Culture"],
//   },
//   {
//     id: 5,
//     title: "Modern Twists on Traditional Ethiopian Dishes",
//     subtitle:
//       "How contemporary Ethiopian chefs are reimagining classic dishes while honoring traditional flavors and techniques.",
//     author: "Chef Tigist Haile",
//     created_at: "March 10, 2024",
//     read_time: "7 min read",
//     category: "Innovation",
//     image: "/placeholder.svg?height=200&width=300",
//     featured: false,
//     tags: ["Modern", "Innovation", "Fusion"],
//   },
//   {
//     id: 6,
//     title: "The Health Benefits of Ethiopian Cuisine",
//     subtitle:
//       "Explore the nutritional advantages of traditional Ethiopian ingredients and cooking methods backed by modern science.",
//     author: "Dr. Selamawit Girma",
//     created_at: "March 8, 2024",
//     read_time: "9 min read",
//     category: "Health",
//     image: "/placeholder.svg?height=200&width=300",
//     featured: false,
//     tags: ["Health", "Nutrition", "Wellness"],
//   },
// ]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const blogPosts = blogStore((store) => store.blogs) || [];
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);
  const fetchBlogs = blogStore((store) => store.fetchBlogs);
  const loading = blogStore((store) => store.loading);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredPosts = regularPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post?.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="">Ethiopian Food Blog</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stories, recipes, and insights from the world of Ethiopian cuisine
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 mb-12 border border-emerald-100 dark:border-emerald-800">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 h-12 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && <FeaturedPost post={featuredPost} />}

        {/* Blog Posts Grid */}
        {loading ? (
          <>
            <BlogPageSkeleton />
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Latest Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Showing {filteredPosts.length} of {regularPosts.length} articles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full px-8"
          >
            Load More Articles
          </Button>
        </div>

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>

      <Footer />
    </div>
  );
}
