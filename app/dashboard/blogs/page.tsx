"use client";
import CreateNewPostButton from "@/components/CreateNewPostButton";
import { createPostColumns } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import { useBlog } from "@/store/DashboardBlog";
import { useAuth } from "@/store/useAuth";
import generate_error from "@/utils/generate_error";
import { Post } from "@/utils/types/Dashboard";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const user_id = useAuth((store) => store.user?.id);
  const fetchBlogs = useBlog((store) => store.fetchBlogs);
  const loading = useBlog((store) => store.loading);
  const blogs = useBlog((store) => store.blogs);
  const deleteBlogs = useBlog((store) => store.deleteBlog);

  useEffect(() => {
    if (user_id) {
      fetchBlogs(user_id);
    }
  }, [fetchBlogs, user_id]);

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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Your Blog Posts
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your blogs, drafts, and published posts.
        </p>
      </div>

      <CreateNewPostButton postType="Blog" />
      <DataTable<Post, any>
        columns={createPostColumns("/blog")}
        data={blogs}
        loading={loading}
        onDeleteSelected={handleDelete}
      />
    </div>
  );
}
