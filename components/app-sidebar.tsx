"use client";

import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Settings,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

import BackNavigation from "./BackNavigation";
import Logout from "./Logout";
import Logo from "./Logo";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Followers", url: "/dashboard/followers", icon: User2 },
  { title: "Recipes", url: "/dashboard/recipes", icon: Inbox },
  { title: "Blogs", url: "/dashboard/blogs", icon: Calendar },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        (pathname.startsWith("/dashboard") &&
          ![
            "/dashboard/followers",
            "/dashboard/recipes",
            "/dashboard/blogs",
            "/dashboard/settings",
          ].some((route) => pathname.startsWith(route)))
      );
    }
    return pathname.startsWith(itemUrl);
  };

  const handleMenuItemClick = () => {
    setTimeout(() => {
      setOpenMobile(false);
    }, 100);
  };

  return (
    <Sidebar>
      <SidebarContent className="p-4 bg-background/70">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Logo />
          </SidebarGroupLabel>

          <SidebarGroupContent className="w-full">
            <SidebarMenu className="mt-10 w-full space-y-1">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        active
                          ? "bg-muted/70 border-l-4 border-l-primary text-foreground shadow-sm"
                          : "hover:bg-muted/40 hover:border-l-4 hover:border-l-border"
                      } p-4 transition-all duration-200 relative rounded-lg mx-2`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                        onClick={handleMenuItemClick}
                      >
                        <item.icon
                          className={`${
                            active ? "text-primary" : "text-muted-foreground"
                          } transition-colors`}
                        />
                        <span
                          className={`font-medium transition-colors ${
                            active ? "text-foreground" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                        {active && (
                          <div className="absolute right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-background/70 border-t border-border/40">
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
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="w-full">
                  <BackNavigation route="/" pagename="home" />
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
