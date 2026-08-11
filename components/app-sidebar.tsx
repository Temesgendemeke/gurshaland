"use client";

import {
  ChevronUp,
  FileText,
  Home,
  Settings,
  User2,
  UtensilsCrossed,
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
import { useEffect, useState } from "react";
import { getProfileByID } from "@/actions/profile/getProfile";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Followers", url: "/dashboard/followers", icon: User2 },
  { title: "Recipes", url: "/dashboard/recipes", icon: UtensilsCrossed },
  { title: "Blogs", url: "/dashboard/blogs", icon: FileText },
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
  // const profile = useProfile((store) => store.profile);
  const [profile, setProfile] = useState<any>(null);
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        // const data = await useProfile
        //   .getState()
        //   .setProfile(await getProfileByID(user.id));
        const data = await getProfileByID(user.id);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user?.id]);

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
            className={`text-lg font-bold text-foreground tracking-tight font-gosh whitespace-nowrap transition-opacity duration-300 ${
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
                          ? "bg-muted/70 border-l-4 border-l-primary text-foreground"
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
                    <AvatarImage
                      src={profile?.image?.url ?? avatarUrl}
                      alt={displayName}
                      className="object-cover w-full h-full"
                    />
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
