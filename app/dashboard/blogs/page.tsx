import { postColumn } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import { Post } from "@/utils/types/Dashboard";
import React from "react";

const page = () => {
  const data: Post[] = [
    {
      id: "1",
      title: "Classic Italian Lasagna",
      view: 2500,
      like: 350,
      comments: 45,
      created_at: "2023-10-26",
      slug: "classic-italian-lasagna",
      status: "published",
    },
    {
      id: "2",
      title: "Spicy Thai Green Curry",
      view: 1800,
      like: 280,
      comments: 32,
      created_at: "2023-09-15",
      slug: "spicy-thai-green-curry",
      status: "published",
    },
    {
      id: "3",
      title: "Beginner's Sourdough Bread",
      view: 950,
      like: 150,
      comments: 60,
      created_at: "2023-11-01",
      slug: "beginners-sourdough-bread",
      status: "draft",
    },
    {
      id: "4",
      title: "The Ultimate Chocolate Chip Cookies",
      view: 5200,
      like: 800,
      comments: 120,
      created_at: "2023-08-20",
      slug: "ultimate-chocolate-chip-cookies",
      status: "published",
    },
    {
      id: "5",
      title: "Healthy Quinoa Salad",
      view: 1200,
      like: 180,
      comments: 25,
      created_at: "2023-10-05",
      slug: "healthy-quinoa-salad",
      status: "published",
    },
    {
      id: "6",
      title: "Vegan Lentil Soup Recipe Ideas",
      view: 450,
      like: 60,
      comments: 15,
      created_at: "2023-11-05",
      slug: "vegan-lentil-soup-ideas",
      status: "draft",
    },
  ];
  return (
    <div>
      <div className="ml-10 mt-4">
        <h2 className="text-4xl font-bold mb-4">📝 Your Blog Posts</h2>
        <p className="mb-6 text-gray-600">
          Here’s a creative overview of all your recipe sections. Track
          progress, assign reviewers, and cook up something amazing!
        </p>
      </div>
      <DataTable<Post, any> columns={postColumn} data={data} />
    </div>
  );
};

export default page;
