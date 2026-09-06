import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleContent from "@/components/ArticleContent";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogCommentSection from "@/components/blog/BlogCommentSection";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRecentBlogsServer } from "@/actions/blog/getBlogBySlug";
import { getFeaturedRecipes, getRecipes } from "@/actions/Recipe/recipe";
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
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let blogPost;
  try {
    blogPost = await getBlogBySlug(slug, user?.id);
  } catch (error) {
    console.log(error);
    return notFound();
  }

  if (!blogPost) {
    return notFound();
  }

  // Fetch sidebar data in parallel
  const [recipesResult, blogsResult] = await Promise.allSettled([
    getFeaturedRecipes().catch(() => getRecipes().catch(() => [])),
    getRecentBlogsServer().catch(() => []),
  ]);

  const sidebarRecipes =
    recipesResult.status === "fulfilled" && Array.isArray(recipesResult.value)
      ? recipesResult.value
      : [];
  const sidebarBlogs =
    blogsResult.status === "fulfilled" && Array.isArray(blogsResult.value)
      ? blogsResult.value
      : [];

  const isOwner = !!user?.id && blogPost.author_id === user.id;

  const relatedPosts: RelatedPost[] = blogPost?.relatives_posts ?? [];
  const authorName =
    blogPost?.author?.full_name || blogPost?.author?.username || "Anonymous";

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <ViewTracker type="blog" id={blogPost?.id ?? 0} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-3.5 py-6 sm:px-6 sm:py-10 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Article Main Column */}
          <div className="lg:col-span-8">
            <ArticleHeader
              blogPost={blogPost}
              viewCount={blogPost.view_count}
              isOwner={isOwner}
            />

            {/* Featured Cover Image */}
            {blogPost?.image?.url && (
              <div className="mt-8 overflow-hidden rounded-xl border border-border/50 bg-muted">
                <div className="relative aspect-[16/9] w-full max-h-[460px]">
                  <Image
                    src={blogPost.image.url}
                    alt={blogPost.title || "Blog featured image"}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
           

            {/* Article Body */}
            <div className="mt-8 md:mt-14">
              <ArticleContent blogPost={blogPost} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <BlogSidebar
                currentSlug={slug}
                recipes={sidebarRecipes}
                blogs={sidebarBlogs}
              />
            </div>
          </div>
        </div>

        {/* Discussion & Comments - Positioned below the sidebar */}
        <section className="mt-12 max-w-4xl">
          <BlogCommentSection
            blogId={blogPost.id}
            postAuthorId={blogPost.author_id || (blogPost.author as any)?.id}
            initialComments={blogPost.comments}
          />
        </section>
      </main>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="mx-auto mt-12 w-full max-w-7xl px-3.5 sm:px-6 lg:px-8">
            <div className="border-t border-border/50 pt-12">
              <h3 className="mb-8 text-2xl font-bold tracking-tight text-foreground font-gosh">
                More articles
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-4 rounded-xl border border-border/40 p-3 hover:border-border transition-all bg-card/50"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={post.image?.url || "/placeholder.svg"}
                        alt={post.title || "Related article"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 p-1">
                      {post.category && (
                        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
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
          </section>
        )
      }
    </div >
  );
};

export default BlogPostPage;
