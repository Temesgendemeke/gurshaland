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
  SidebarHeader,
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
import { useAuth } from "@/store/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BackNavigation from "./BackNavigation";
import Logout from "./Logout";
import Image from "next/image";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Followers", url: "/dashboard/followers", icon: User2 },
  { title: "Recipes", url: "/dashboard/recipes", icon: Inbox },
  { title: "Blogs", url: "/dashboard/blogs", icon: Calendar },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const collapsed = state === "collapsed";
  const user = useAuth((store) => store.user);

  const displayName =
    user?.user_metadata?.full_name || user?.email || "Account";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

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
    setTimeout(() => setOpenMobile(false), 100);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Logo header — lettermark only when collapsed, full logo when expanded */}
      <SidebarHeader className="border-b border-border/50 px-3 h-12 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2.5 overflow-hidden w-full"
        >
          {/* Lettermark — always visible */}
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            {/* <span className="text-primary-foreground font-bold text-sm font-gosh leading-none">
              G
            </span> */}
            <Image
              src="/logo.png"
              alt="Gurshaland Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          {/* Wordmark — hidden when collapsed */}
          <span
            className={`text-lg font-bold text-foreground tracking-tight font-gosh whitespace-nowrap transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              // collapsed ? "opacity-0" : "opacity-100"
              collapsed ? "hidden" : "inline"
            }`}
          >
            Gurshaland
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent className="w-full">
            <SidebarMenu className="w-full space-y-1">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`${
                        active
                          ? "bg-muted/70 border-l-4 border-l-primary text-foreground shadow-sm"
                          : "hover:bg-muted/40 hover:border-l-4 hover:border-l-border"
                      } p-4 transition-colors relative rounded-lg`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                        onClick={handleMenuItemClick}
                      >
                        <item.icon
                          className={`flex-shrink-0 ${
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
                        {/* {active && (
                          <div className="absolute right-2 w-2 h-2 bg-primary rounded-full" />
                        )} */}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto flex-shrink-0" />
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
