import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import BackNavigation from "@/components/BackNavigation";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleContent from "@/components/ArticleContent";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/actions/blog/getBlogBySlug";
import { createClient } from "@/utils/supabase/server";
import ViewTracker from "@/components/ViewTracker";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user?.id && blogPost.author_id === user.id;

  const relatedPosts: RelatedPost[] = blogPost?.relatives_posts ?? [];

  return (
    <div className="min-h-screen">
      <Header />
      {!isOwner && <ViewTracker type="blog" id={blogPost?.id ?? 0} />}

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-6">
        <BackNavigation route="/blog" pagename="Blogs" />

        <div className="mt-4">
          <ArticleHeader blogPost={blogPost} viewCount={blogPost.view_count} />
        </div>
      </div>

      {/* Featured image */}
      {blogPost?.image?.url && (
        <div className=" mt-6 w-full max-w-full px-4 sm:px-6">
          <div className="relative aspect-[16/7] max-h-[420px] overflow-hidden rounded-xl bg-muted">
            <Image
              src={blogPost.image.url}
              alt={blogPost.title || "Blog featured image"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article body — narrow reading width */}
      <div className="mx-auto mt-12 px-4 sm:px-6 md:mt-16">
        <ArticleContent blogPost={blogPost} />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6">
          <div className="border-t border-border/50 pt-12">
            <h3 className="mb-10 text-xl font-bold tracking-tight text-foreground">
              More articles
            </h3>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={post.image?.url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {post.category && (
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {post.category}
                      </p>
                    )}
                    <h4 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
                      {post.title}
                    </h4>
                    {post.subtitle && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
