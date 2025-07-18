import { Calendar, Clock, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { format_date } from "@/utils/formatdate";

export default function FeaturedPost({ post }: { post: typeof blogPosts[0] }) {
  return (
    <div className="mb-16">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Featured Article</h2>
      </div>
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-emerald-100 dark:border-emerald-800">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img
                src={post.image.url || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-emerald-600 text-white">Featured</Badge>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                {post.category}
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author?.full_name || post.author?.username || "unkown"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format_date(post.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  )
}