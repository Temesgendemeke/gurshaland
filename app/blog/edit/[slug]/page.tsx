"use client";
import BlogForm from "@/components/blog/BlogForm";
import { Header } from "@/components/header";
import React, { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useParams } from "next/navigation";
import { useBlogDetailStore } from "@/store/BlogDetail";

function Page(): React.JSX.Element {
  const param = useParams();
  const user = useAuth((store) => store.user);
  const fetchBlog = useBlogDetailStore((store) => store.fetchBlog);
  const blog = useBlogDetailStore((store) => store.blog);
  const loading = useBlogDetailStore((store) => store.loading);

  useEffect(() => {
    if (param?.slug) {
      fetchBlog(param.slug as string, user?.id);
    }
  }, [param?.slug, user?.id]);

  if (loading || !blog) {
    return (
      <>
        <Header />
        <div className="w-full mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mt-16 flex flex-col items-center justify-center space-y-4 py-16">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">
              Loading your blog post...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mt-6 space-y-3 text-center flex flex-col items-center justify-center">
            <h1 className="font-gosh text-3xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Refine your story
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Update your blog post and share Ethiopian stories with the world.
            </p>
          </div>
          {/* Form */}
          <div className="mt-10">
            <BlogForm blog={blog} mode="update" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
