"use client";
import { getBlogByAuthor } from "@/actions/blog/blog";
import CreateNewPostButton from "@/components/CreateNewPostButton";
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
  const deleteBlogs = useBlog((store) => store.deleteBlog)

  useEffect(() => {
    if (user_id) {
      fetchBlogs(user_id);
    }
  }, [user_id]);


  const handleDelete = async(rows: Post[]) =>{
    try {
      for (const row of rows){
         await deleteBlogs(row.slug)
         toast.success(`${row.title} Blog deleted successfully`)
      }
    } catch (error) {
      toast.error(generate_error(error))
    }
  }
  return (
    <div className="mx-5 md:mx-10">
      <div className="mt-4 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-4">Your Blog Posts</h2>
        <p className="mb-6 text-gray-600 max-w-full">
          Here’s a creative overview of all your recipe sections. Track
          progress, assign reviewers, and cook up something amazing!
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
};

export default page;
