"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coffee, Users, Calendar, BookOpen, Heart, Star } from "lucide-react"

export default function CulturePage() {
  const culturalTopics = [
    {
      id: "coffee-ceremony",
      title: "Ethiopian Coffee Ceremony",
      description: "The sacred ritual of coffee preparation and sharing in Ethiopian culture",
      image: "/placeholder.svg?height=300&width=400",
      icon: Coffee,
      color: "from-amber-600 to-brown-600",
      readTime: "8 min read",
      category: "Traditions",
    },
    {
      id: "dining-traditions",
      title: "Communal Dining & Gursha",
      description: "The beautiful tradition of sharing food and feeding each other",
      image: "/placeholder.svg?height=300&width=400",
      icon: Users,
      color: "from-emerald-600 to-green-600",
      readTime: "6 min read",
      category: "Traditions",
    },
    {
      id: "fasting-foods",
      title: "Fasting & Religious Foods",
      description: "How Ethiopian Orthodox fasting shapes the cuisine",
      image: "/placeholder.svg?height=300&width=400",
      icon: Heart,
      color: "from-purple-600 to-indigo-600",
      readTime: "10 min read",
      category: "Religion",
    },
    {
      id: "festivals",
      title: "Food Festivals & Celebrations",
      description: "Traditional foods for Ethiopian holidays and celebrations",
      image: "/placeholder.svg?height=300&width=400",
      icon: Calendar,
      color: "from-red-600 to-pink-600",
      readTime: "7 min read",
      category: "Celebrations",
    },
    {
      id: "history",
      title: "Culinary History",
      description: "The ancient roots and evolution of Ethiopian cuisine",
      image: "/placeholder.svg?height=300&width=400",
      icon: BookOpen,
      color: "from-yellow-600 to-orange-600",
      readTime: "12 min read",
      category: "History",
    },
    {
      id: "spice-trade",
      title: "The Spice Trade Legacy",
      description: "How trade routes shaped Ethiopian flavors and spices",
      image: "/placeholder.svg?height=300&width=400",
      icon: Star,
      color: "from-orange-600 to-red-600",
      readTime: "9 min read",
      category: "History",
    },
  ]

  const featuredStories = [
    {
      title: "The Story of Injera",
      excerpt: "How a simple grain became the foundation of Ethiopian cuisine",
      author: "Dr. Almaz Bekele",
      date: "March 15, 2024",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Berbere: The Soul of Ethiopian Cooking",
      excerpt: "The complex spice blend that defines Ethiopian flavors",
      author: "Chef Dawit Haile",
      date: "March 10, 2024",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-emerald-200 dark:border-emerald-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ethiopian Heritage</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-700 via-yellow-600 to-red-600 bg-clip-text text-transparent">
              Ethiopian
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">Culture</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            Discover the rich traditions, customs, and stories behind Ethiopian cuisine and dining culture
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Stories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Featured Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Deep dives into Ethiopian culinary heritage</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredStories.map((story, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800"
              >
                <div className="relative">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>by {story.author}</span>
                    <span>{story.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Cultural Topics */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Explore Ethiopian Culture</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Learn about the traditions that shape Ethiopian cuisine
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {culturalTopics.map((topic) => {
              const IconComponent = topic.icon
              return (
                <Link key={topic.id} href={`/culture/${topic.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800 h-full">
                    <div className="relative">
                      <img
                        src={topic.image || "/placeholder.svg"}
                        alt={topic.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${topic.color} rounded-full flex items-center justify-center`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                            {topic.category}
                          </span>
                          <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">{topic.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{topic.description}</p>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <Card className="p-12 bg-gradient-to-r from-emerald-600/10 to-red-600/10 dark:from-emerald-600/20 dark:to-red-600/20 border-emerald-200 dark:border-emerald-700">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Share Your Cultural Story</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Have a family tradition or cultural story to share? Help preserve Ethiopian heritage for future
              generations.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white px-8 py-4 text-lg rounded-full"
            >
              <Link href="/contact">Share Your Story</Link>
            </Button>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
