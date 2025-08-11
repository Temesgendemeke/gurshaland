import { AppSidebar } from "@/components/app-sidebar";
import { postColumn } from "@/components/dashboard/PostColumn";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { DataTable } from "@/components/data-table";
// import { DataTable } from "@/components/DataTable";
import StatsCard from "@/components/StatsCard";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Post } from "@/utils/types/Dashboard";
import { Send, User2, UtensilsCrossed } from "lucide-react";

export default function Page() {
  const data: Post[] = [
    {
      id: "1",
      title: "Understanding React Hooks",
      like: 120,
      view: 1500,
      status: "published",
      slug: "understanding-react-hooks",
      created_at: "2024-06-01",
      comments: 45,
    },
    {
      id: "2",
      title: "A Guide to TypeScript",
      like: 80,
      view: 900,
      status: "draft",
      slug: "a-guide-to-typescript",
      created_at: "2024-06-02",
      comments: 30,
    },
    {
      id: "3",
      title: "Styling in Next.js",
      like: 95,
      view: 1100,
      status: "published",
      slug: "styling-in-nextjs",
      created_at: "2024-06-03",
      comments: 38,
    },
    {
      id: "4",
      title: "Deploying with Vercel",
      like: 60,
      view: 700,
      status: "draft",
      slug: "deploying-with-vercel",
      created_at: "2024-06-04",
      comments: 22,
    },
    {
      id: "5",
      title: "API Routes Explained",
      like: 130,
      view: 1700,
      status: "published",
      slug: "api-routes-explained",
      created_at: "2024-06-05",
      comments: 50,
    },
    {
      id: "6",
      title: "Optimizing Performance",
      like: 75,
      view: 850,
      status: "draft",
      slug: "optimizing-performance",
      created_at: "2024-06-06",
      comments: 27,
    },
    {
      id: "7",
      title: "Authentication Strategies",
      like: 110,
      view: 1400,
      status: "published",
      slug: "authentication-strategies",
      created_at: "2024-06-07",
      comments: 41,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 space-y-5">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 ml-5 mt-2">
          <h2 className="text-3xl md:text-4xl font-bold">Dashboard Overview</h2>
          <Separator orientation="vertical" className="h-8" />
          <span className="text-muted-foreground text-lg">Welcome back!</span>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 mx-5">
          <StatsCard name={"followers"} count={400} Icon={User2} />
          <StatsCard name={"recipes"} count={400} Icon={UtensilsCrossed} />
          <StatsCard name={"blogs"} count={400} Icon={Send} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex-1">
          
          {/* <DataTable data={data} /> */}
          <SimpleTable
            data={data.sort((a, b) => Number(b.view) - Number(a.view))}
            name="Recipe"
          />
        </div>
        <div className="flex-1">
          {/* <DataTable<Post, any> columns={postColumn} data={data} /> */}
          <SimpleTable
            data={data.sort((a, b) => Number(b.view) - Number(a.view))}
            name="Blog"
          />
        </div>
      </div>
    </div>
  );
}
