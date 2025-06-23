"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import BackNavigation from "@/components/BackNavigation";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleContent from "@/components/ArticleContent";

const blogPost = {
  id: 1,
  title: "The Art of Making Perfect Injera at Home",
  subtitle: "Master Ethiopia's beloved flatbread with traditional techniques",
  author: "Chef Almaz Tadesse",
  date: "March 20, 2024",
  readTime: "8 min read",
  category: "Recipes",
  image: "/placeholder.svg?height=400&width=800",
  tags: ["Injera", "Traditional", "Baking", "Ethiopian"],
  content: [
    {
      type: "paragraph",
      text: "Injera is more than just bread in Ethiopian culture—it's the foundation of every meal, the plate from which you eat, and a symbol of community and sharing. This ancient fermented flatbread, made from the tiny grain teff, has sustained Ethiopian families for thousands of years.",
    },
    {
      type: "heading",
      text: "Understanding Teff: The Ancient Grain",
    },
    {
      type: "paragraph",
      text: "Teff (Eragrostis tef) is a tiny grain native to Ethiopia, packed with protein, fiber, and essential minerals. Its unique properties make it perfect for fermentation, creating injera's characteristic spongy texture and slightly sour taste.",
    },
    {
      type: "recipe",
      title: "Traditional Injera Recipe",
      ingredients: [
        "4 cups teff flour",
        "5 cups water (room temperature)",
        "1 tsp active dry yeast (optional)",
        "1 tsp salt",
      ],
      instructions: [
        "Mix teff flour with 3 cups of water in a large bowl",
        "Cover and let ferment for 3 days at room temperature",
        "Cook 1 cup of fermented batter with 1 cup water until thick",
        "Mix cooked starter back into fermented batter",
        "Cook on a non-stick pan or traditional mitad",
      ],
    },
    {
      type: "heading",
      text: "The Fermentation Process",
    },
    {
      type: "paragraph",
      text: "The key to perfect injera lies in the fermentation. The natural yeasts and bacteria in the teff flour create the bubbles that give injera its spongy texture. This process can take 3-5 days, depending on temperature and humidity.",
    },
    {
      type: "tips",
      title: "Pro Tips for Perfect Injera",
      items: [
        "Use filtered water for better fermentation",
        "Keep the batter at consistent room temperature",
        "The batter should smell pleasantly sour when ready",
        "Don't flip the injera—it cooks from steam underneath",
        "Store finished injera wrapped in clean cloth",
      ],
    },
  ],
};

const relatedPosts = [
  {
    title: "Berbere Spice Blend Guide",
    excerpt: "Learn to make Ethiopia's most important spice blend",
    image: "/placeholder.svg?height=150&width=200",
    slug: "berbere-spice-guide",
  },
  {
    title: "Ethiopian Coffee Ceremony",
    excerpt: "The sacred ritual of coffee in Ethiopian culture",
    image: "/placeholder.svg?height=150&width=200",
    slug: "coffee-ceremony",
  },
  {
    title: "Vegetarian Ethiopian Dishes",
    excerpt: "Plant-based recipes for fasting and everyday meals",
    image: "/placeholder.svg?height=150&width=200",
    slug: "vegetarian-dishes",
  },
];

const BlogPostPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <BackNavigation route="/blog" pagename="Blogs"/>

        {/* Article Header */}
        <ArticleHeader blogPost={blogPost} />

        {/* Featured Image */}
        <div className="mb-12">
          <img
            src={blogPost.image || "/placeholder.svg"}
            alt={blogPost.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <ArticleContent blogPost={blogPost} />

        {/* Engagement Section */}
        <Card className="p-6 mb-12 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                Like (24)
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comment (8)
              </Button>
            </div>
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </Card>

        {/* Related Posts */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            Related Articles
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <Link key={index} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
