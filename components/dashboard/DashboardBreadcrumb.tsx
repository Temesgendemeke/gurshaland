"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const rootLabels: Record<string, string> = {
  followers: "Followers",
  recipes: "Recipes",
  blogs: "Blogs",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length < 2 || parts[0] !== "dashboard") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const root = parts[1];
  const label = rootLabels[root] ?? "Dashboard";
  const isSubPage = parts.length > 2;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isSubPage ? (
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isSubPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/dashboard/${root}`}>{label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {parts[2].replace(/-/g, " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
