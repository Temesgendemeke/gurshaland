"use client";
import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Logo from "./Logo";
import Link from "next/link";
import Logout from "./Logout";
import BackNavigation from "./BackNavigation";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Followers",
    url: "/dashboard/followers",
    icon: User2, 
  },
  {
    title: "Recipes",
    url: "/dashboard/recipes",
    icon: Inbox,
  },
  {
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const currentPath =
    typeof window !== "undefined" ? usePathname().split("dashboard/") : [];

  return (
    <Sidebar>
      <SidebarContent className="p-4 bg-background/70">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Logo />
          </SidebarGroupLabel>
          <SidebarGroupContent className="w-full">
            <SidebarMenu className="mt-10  w-full">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      (currentPath.length < 2 && item.url === "/dashboard") ||
                      ("/dashboard/" + currentPath[1] === item.url)
                        ? "bg-muted"
                        : ""
                    } p-4`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-background/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] flex flex-col items-start"
              >
                <DropdownMenuItem className=" w-full">
                  <BackNavigation />
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full">
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
