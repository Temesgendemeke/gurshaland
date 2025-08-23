"use client";
import { getBlogByAuthor } from "@/actions/blog/blog";
import { createPostColumns } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import { useBlog } from "@/store/DashboardBlog";
import { useAuth } from "@/store/useAuth";
import generate_error from "@/utils/generate_error";
import { Post } from "@/utils/types/Dashboard";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const user_id = useAuth((store) => store.user?.id);
  const fetchBlogs = useBlog((store) => store.fetchBlogs);
  const loading = useBlog((store) => store.loading);
  const blogs = useBlog((store) => store.blogs);

  useEffect(() => {
    if (user_id) {
      fetchBlogs(user_id);
    }
  }, [user_id]);
  return (
    <div className="mx-5 md:mx-10">
      <div className="mt-4 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-4">Your Blog Posts</h2>
        <p className="mb-6 text-gray-600 max-w-full">
          Here’s a creative overview of all your recipe sections. Track
          progress, assign reviewers, and cook up something amazing!
        </p>
      </div>

      <div className="flex justify-end">
        <Link
          href="/blog/create"
          className="flex gap-1 p-2 rounded-sm btn-primary-modern"
        >
          <PlusCircle />
          <span>create new blog</span>
        </Link>
      </div>
      <DataTable<Post, any>
        columns={createPostColumns("/blog")}
        data={blogs}
        loading={loading}
      />
    </div>
  );
};

export default page;
