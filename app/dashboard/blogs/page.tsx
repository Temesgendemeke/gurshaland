"use client";
import CreateNewPostButton from "@/components/CreateNewPostButton";
import { createPostColumns } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import StatsCard from "@/components/StatsCard";
import { Separator } from "@/components/ui/separator";
import { useBlog } from "@/store/DashboardBlog";
import { useAuth } from "@/store/useAuth";
import generate_error from "@/utils/generate_error";
import { Post } from "@/utils/types/Dashboard";
import { CheckCircle2, Eye, FileEdit, Send } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function Page() {
  const user_id = useAuth((store) => store.user?.id);
  const fetchBlogs = useBlog((store) => store.fetchBlogs);
  const loading = useBlog((store) => store.loading);
  const blogs = useBlog((store) => store.blogs);
  const deleteBlogs = useBlog((store) => store.deleteBlog);
  const error = useBlog((store) => store.error);

  useEffect(() => {
    if (user_id) {
      fetchBlogs(user_id);
    }
  }, [fetchBlogs, user_id]);

  const publishedCount = useMemo(
    () => blogs.filter((b) => b.status === "published").length,
    [blogs],
  );
  const draftCount = useMemo(
    () => blogs.filter((b) => b.status === "draft").length,
    [blogs],
  );
  const totalViews = useMemo(
    () => blogs.reduce((sum, b) => sum + (b.view_count ?? 0), 0),
    [blogs],
  );

  const handleDelete = async (rows: Post[]) => {
    try {
      for (const row of rows) {
        await deleteBlogs(row.slug);
        toast.success(`${row.title} Blog deleted successfully`);
      }
    } catch (error) {
      toast.error(generate_error(error));
    }
  };
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-gosh tracking-tight text-foreground">
              Your Blog Posts
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track your blogs, drafts, and published posts.
            </p>
          </div>
          <CreateNewPostButton postType="Blog" />
        </div>

        <Separator className="opacity-60" />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error} Showing cached values if available.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            name="blogs"
            count={blogs.length}
            Icon={Send}
            loading={loading}
            type="follower"
            href="/dashboard/blogs"
          />
          <StatsCard
            name="published"
            count={publishedCount}
            Icon={CheckCircle2}
            loading={loading}
            type="follower"
            href="/dashboard/blogs"
          />
          <StatsCard
            name="drafts"
            count={draftCount}
            Icon={FileEdit}
            loading={loading}
            type="follower"
            href="/dashboard/blogs"
          />
          <StatsCard
            name="views"
            count={totalViews}
            Icon={Eye}
            loading={loading}
            type="follower"
            href="/dashboard/blogs"
          />
        </div>
      </div>

      <DataTable<Post, any>
        columns={createPostColumns("/blog")}
        data={blogs}
        loading={loading}
        onDeleteSelected={handleDelete}
      />
    </div>
  );
}
