"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Share2,
  Heart,
  BookOpen,
} from "lucide-react";
import BackNavigation from "@/components/BackNavigation";
import ArticleHeader from "@/components/ArticleHeader";

export default function CultureTopicPage({
  params,
}: {
  params: { topic: string };
}) {
  // Mock data - in real app, fetch based on params.topic
  const topicData = {
    "coffee-ceremony": {
      title: "Ethiopian Coffee Ceremony",
      subtitle: "The Sacred Ritual of Coffee",
      category: "Traditions",
      readTime: "8 min read",
      author: "Dr. Almaz Bekele",
      date: "March 15, 2024",
      image: "/placeholder.svg?height=400&width=800",
      content: [
        {
          type: "paragraph",
          text: "The Ethiopian coffee ceremony is far more than just brewing coffee—it's a sacred ritual that brings communities together, honors guests, and connects people to their cultural heritage. This ancient tradition, passed down through generations, represents hospitality, respect, and spiritual connection.",
        },
        {
          type: "heading",
          text: "The Three Rounds",
        },
        {
          type: "paragraph",
          text: "The ceremony consists of three distinct rounds, each with its own significance:",
        },
        {
          type: "list",
          items: [
            "Abol - The first round, representing blessing",
            "Tona - The second round, symbolizing peace",
            "Baraka - The third round, bringing good fortune",
          ],
        },
        {
          type: "heading",
          text: "The Ritual Process",
        },
        {
          type: "paragraph",
          text: "The ceremony begins with washing green coffee beans, then roasting them over an open flame. The aromatic smoke is wafted toward guests as a blessing. The beans are then ground by hand and brewed in a traditional clay pot called a jebena.",
        },
        {
          type: "quote",
          text: "Coffee is our bread, our culture, our identity. When we share coffee, we share our souls.",
          author: "Ethiopian Proverb",
        },
        {
          type: "paragraph",
          text: "The ceremony can take several hours, emphasizing the importance of slowing down, connecting with others, and appreciating the moment. It's a time for conversation, storytelling, and strengthening community bonds.",
        },
      ],
    },
  };

  const currentTopic =
    topicData[params.topic as keyof typeof topicData] ||
    topicData["coffee-ceremony"];

  const relatedTopics = [
    {
      title: "Communal Dining Traditions",
      excerpt: "The beautiful practice of sharing meals in Ethiopian culture",
      image: "/placeholder.svg?height=150&width=200",
      slug: "dining-traditions",
    },
    {
      title: "Fasting Foods & Religion",
      excerpt: "How Orthodox fasting shapes Ethiopian cuisine",
      image: "/placeholder.svg?height=150&width=200",
      slug: "fasting-foods",
    },
    {
      title: "Ethiopian Festivals",
      excerpt: "Traditional foods for celebrations and holidays",
      image: "/placeholder.svg?height=150&width=200",
      slug: "festivals",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <BackNavigation pagename={"Culture"} route="/culture" />

        {/* Article Header */}
        <ArticleHeader blogPost={currentTopic} />

        {/* Featured Image */}
        <div className="mb-12">
          <img
            src={currentTopic.image || "/placeholder.svg"}
            alt={currentTopic.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          {currentTopic.content.map((section, index) => {
            switch (section.type) {
              case "paragraph":
                return (
                  <p
                    key={index}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
                  >
                    {section.text}
                  </p>
                );
              case "heading":
                return (
                  <h2
                    key={index}
                    className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4"
                  >
                    {section.text}
                  </h2>
                );
              case "list":
                return (
                  <ul
                    key={index}
                    className="list-disc list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300"
                  >
                    {section.items?.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                );
              case "quote":
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-emerald-500 pl-6 py-4 my-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-r-lg"
                  >
                    <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                      "{section.text}"
                    </p>
                    {section.author && (
                      <cite className="text-sm text-gray-500 dark:text-gray-400">
                        — {section.author}
                      </cite>
                    )}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Related Topics */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400" />
            Related Topics
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedTopics.map((topic, index) => (
              <Link key={index} href={`/culture/${topic.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-emerald-800">
                  <img
                    src={topic.image || "/placeholder.svg"}
                    alt={topic.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {topic.excerpt}
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
}
