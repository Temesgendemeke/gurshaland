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
  useSidebar,
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
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // Helper function to check if a menu item is active
  const isActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard") {
      // For home, check if we're exactly on /dashboard or if no other dashboard sub-route is active
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
    // For other items, check if the current path starts with the item URL
    return pathname.startsWith(itemUrl);
  };

  const handleMenuItemClick = () => {
    // Small delay to ensure smooth navigation before closing sidebar
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      isActive(item.url)
                        ? "bg-muted/80 border-l-4 border-l-emerald-400 text-primary shadow-sm"
                        : "hover:bg-muted/50 hover:border-l-4 hover:border-l-muted-foreground/20"
                    } p-4 transition-all duration-200 relative rounded-lg mx-2`}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 w-full"
                      onClick={handleMenuItemClick}
                    >
                      <item.icon
                        className={`${
                          isActive(item.url)
                            ? "text-emerald-400 "
                            : "text-muted-foreground"
                        } transition-colors`}
                      />
                      <span
                        className={`font-medium transition-colors ${
                          isActive(item.url) ? "text-emerald-400" : ""
                        }`}
                      >
                        {item.title}
                      </span>
                      {isActive(item.url) && (
                        <div className="absolute right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      )}
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
