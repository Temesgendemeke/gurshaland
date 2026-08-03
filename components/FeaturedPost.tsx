import {
  ArrowTrendingUpIcon as TrendingUp,
  UserIcon as User,
  CalendarIcon as Calendar,
  ClockIcon as Clock,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { format_date } from "@/utils/formatdate";

export default function FeaturedPost({
  post,
}: {
  post: (typeof blogPosts)[0];
}) {
  return (
    <div className="mb-16">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-5 h-5 text-primary mr-2" />
        <h2 className="text-2xl font-bold text-foreground">Featured Article</h2>
      </div>
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group bg-card/70 backdrop-blur-sm border-primary/20">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img
                src={post.image.url || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4 bg-primary/10 text-primary">
                {post.category}
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>
                      {post.author?.full_name ||
                        post.author?.username ||
                        "unkown"}
                    </span>
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
  );
}
