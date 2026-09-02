"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  BookAIcon,
  Heart,
  LogInIcon,
  LogOutIcon,
  Settings,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { logout } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import useProfile from "@/store/Profile";

interface AccountDropDownProps {
  user: User | null;
}

const AccountDropDown = ({ user }: AccountDropDownProps) => {
  const router = useRouter();
  const profile = useProfile((state) => state.profile);

  const username = profile?.username || user?.user_metadata?.username || "";
  const displayName = profile?.full_name || username || "Profile";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to log out.");
    }
  };

  const dropdownList = [
    {
      route: username ? `/profile/${username}` : "/",
      page: "Profile",
      icon: UserIcon,
    },
    {
      route: "/meal-planner/my-meal-plans",
      page: "Meal Planner",
      icon: BookAIcon,
    },
    {
      route: "/favorites",
      page: "Favorites",
      icon: Heart,
    },
    {
      route: username ? `/profile/${username}/settings` : "/",
      page: "Settings",
      icon: Settings,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account menu"
          className="rounded-full border border-border/70 bg-background hover:border-primary/40 hover:bg-muted"
        >
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background w-56 p-1.5">
        {user ? (
          <>
            <div className="mb-1 flex items-center gap-3 border-b border-border/70 px-2.5 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {profile?.image?.url ? (
                  <img
                    src={profile.image.url}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-4.5 w-4.5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                {user.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {dropdownList.map((element) => (
              <DropdownMenuItem key={element.route} asChild>
                <Link
                  href={element.route}
                  className="gap-2.5 text-muted-foreground focus:text-foreground"
                >
                  <element.icon className="text-muted-foreground" />
                  <span>{element.page}</span>
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={handleLogout}
              className="gap-2.5 text-error focus:text-error"
            >
              <LogOutIcon />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link
              href="/login"
              className="gap-2.5 text-muted-foreground focus:text-foreground"
            >
              <LogInIcon className="text-muted-foreground" />
              <span>Login</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropDown;
