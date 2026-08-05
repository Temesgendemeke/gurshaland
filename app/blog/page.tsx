"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
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
import BlogPostCard from "@/components/BlogPostCard";
import FeaturedPost from "@/components/FeaturedPost";
import categories from "@/constants/categories";
import { blogStore } from "@/store/Blog";
import BlogPageSkeleton from "@/components/skeleton/BlogPageSkeleton";

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
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 mt-6 md:mt-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="">Ethiopian Food Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stories, recipes, and insights from the world of Ethiopian cuisine
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-2 mb-12 mx-auto max-w-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-border bg-background"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 h-12 border-border bg-background">
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
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Latest Articles
              </h2>
              <p className="text-muted-foreground mb-8">
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
            className="px-8 text-primary"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
