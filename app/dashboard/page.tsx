"use client";
import { getStatus } from "@/actions/dashboard/stats";
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
import { useAuth } from "@/store/useAuth";
import { Blog } from "@/utils/types/blog";
import { Post } from "@/utils/types/Dashboard";
import Recipe from "@/utils/types/recipe";
import { Send, User2, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Status {
  followers_count: number;
  recipes: Post[];
  blogs: Post[];
}

export default function Page() {
  const [status, setStatus] = useState<Status>({
    followers_count: 0,
    recipes: [],
    blogs: [],
  });
  const [loading, setLoading] = useState<Boolean>(true);
  const user = useAuth((store) => store.user);
  const router = useRouter();



  useEffect(() => {
    (async () => {
      if (user) {
        const data = await getStatus(user.id as string);
        setStatus(data);
        setLoading(false);
      }
    })();
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 space-y-5">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 ml-5 mt-2">
          <h2 className="text-3xl md:text-4xl font-bold">Dashboard Overview</h2>
          <Separator orientation="vertical" className="h-8" />
          <span className="text-muted-foreground text-lg">Welcome back!</span>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 mx-5">
          <StatsCard
            name={"followers"}
            count={status.followers_count}
            Icon={User2}
            loading={loading}
          />
          <StatsCard
            name={"recipes"}
            count={status.recipes.length}
            Icon={UtensilsCrossed}
            loading={loading}
          />
          <StatsCard
            name={"blogs"}
            count={status.blogs.length}
            Icon={Send}
            loading={loading}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex-1">
          <SimpleTable data={status.recipes} name="Recipe" loading={loading} />
        </div>
        <div className="flex-1">
          <SimpleTable data={status.blogs} name="Blog" loading={loading} />
        </div>
      </div>
    </div>
  );
}
