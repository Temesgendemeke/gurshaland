import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Header } from "@/components/header";
import BackNavigation from "@/components/BackNavigation";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleContent from "@/components/ArticleContent";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/actions/blog/blog";
import { BackButton } from "@/components/back-button";

type RelatedPost = {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  image?: { url: string };
};

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  let blogPost;
  const { slug } = await params;
  try {
    blogPost = await getBlogBySlug(slug);
  } catch (error) {
    console.log(error);
    return notFound();
  }

  if (!blogPost) {
    return notFound();
  }

  const relatedPosts: RelatedPost[] = blogPost?.relatives_posts ?? [];

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-6">
        <BackNavigation route="/blog" pagename="Blogs" />

        <div className="mt-4">
          <ArticleHeader blogPost={blogPost} />
        </div>

        {/* Featured image */}
        <div className="mx-auto mt-10 w-full ">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border/60 bg-muted md:aspect-[21/10]">
            <Image
              src={blogPost?.image?.url || "/placeholder.svg"}
              alt={blogPost?.title || "Blog featured image"}
              fill
              priority
              sizes="(max-width: 396px) 100vw, 396px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Article content */}
        <div className="mt-14">
          <ArticleContent blogPost={blogPost} />
        </div>

        {/* Engagement */}
        <div className="mx-auto mt-14 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card px-3 py-2 shadow-[0_1px_2px_hsl(215_15%_10%/0.04)] sm:justify-between sm:px-6">
            <p className="hidden text-sm font-medium text-muted-foreground sm:block">
              Enjoyed this story?
            </p>
            <div className="flex items-center gap-1">
              <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                <Heart className="h-4 w-4" />
                Like
              </button>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                <MessageCircle className="h-4 w-4" />
                Comment
              </button>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-border/70 pt-12">
            <h3 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
              Related Articles
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300  hover:border-primary  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={post.image?.url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {post.category && (
                      <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary">
                        {post.category}
                      </p>
                    )}
                    <h4 className="mb-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                      {post.title}
                    </h4>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
