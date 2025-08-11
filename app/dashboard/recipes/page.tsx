import { postColumn } from "@/components/dashboard/PostColumn";
import { DataTable } from "@/components/data-table";
import { Post } from "@/utils/types/Dashboard";
import React from "react";

const page = () => {
  const data: Post[] = [
    {
      id: "REC001",
      title: "Spicy Lentil Soup",
      view: 1200,
      like: 340,
      comments: 45,
      created_at: "2023-10-27",
      slug: "spicy-lentil-soup",
      status: "published",
    },
    {
      id: "REC002",
      title: "Classic Margherita Pizza",
      view: 2500,
      like: 800,
      comments: 120,
      created_at: "2023-10-26",
      slug: "classic-margherita-pizza",
      status: "published",
    },
    {
      id: "REC003",
      title: "Vegan Chocolate Avocado Mousse",
      view: 850,
      like: 210,
      comments: 30,
      created_at: "2023-10-25",
      slug: "vegan-chocolate-avocado-mousse",
      status: "draft",
    },
    {
      id: "REC004",
      title: "Garlic Butter Shrimp Scampi",
      view: 1800,
      like: 650,
      comments: 90,
      created_at: "2023-10-24",
      slug: "garlic-butter-shrimp-scampi",
      status: "published",
    },
    {
      id: "REC005",
      title: "Quinoa Salad with Roasted Vegetables",
      view: 950,
      like: 150,
      comments: 25,
      created_at: "2023-10-23",
      slug: "quinoa-salad-roasted-vegetables",
      status: "published",
    },
  ];

  return (
    <div>
      <div className="ml-10">
        <h2 className="text-4xl font-bold mb-4">🍽️ Your Recipe Posts</h2>
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
