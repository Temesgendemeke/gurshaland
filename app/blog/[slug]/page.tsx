import React from "react";
import { Header } from "@/components/header";
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
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/actions/blog/blog";

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  let blogPost;
  const { slug } = await params;
  try {
    blogPost = await getBlogBySlug(slug);
  } catch (error) {
    console.log(error);
    return notFound();
  }

  return (
    <div className="">
      <Header />

      <div className="max-w-7xl mx-auto py-12 space-y-4">
        {/* Back Navigation */}
        <BackNavigation route="/blog" pagename="Blogs" />

        {/* Article Header */}
        <ArticleHeader blogPost={blogPost} />

        {/* Featured Image */}
        <div className="mb-12">
          <img
            src={blogPost?.image?.url || "/placeholder.svg"}
            alt={blogPost?.title || "Blog featured image"}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Article Content */}
        <ArticleContent blogPost={blogPost} />

        {/* Engagement Section */}
        <Card className="p-6 mb-12 bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                Like (24)
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comment (8)
              </Button>
            </div>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </Card>

        {/* Related Posts */}
        <div className="border-t border-border pt-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Related Articles
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPost?.relatives_posts?.map((post: any, index: number) => (
              <Link key={index} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden group bg-card border border-border">
                  <img
                    src={post.image?.url || "/placeholder.svg"}
                    alt={post?.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {post?.subtitle}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BlogPostPage;
