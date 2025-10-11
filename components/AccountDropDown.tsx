"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  ForkKnifeIcon,
  Heart,
  LayoutDashboard,
  LogInIcon,
  LogOutIcon,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { logout } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AccountDropDownProps {
  user: User | null;
}

const AccountDropDown = ({ user }: AccountDropDownProps) => {
  const router = useRouter();

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
      route: "/profile",
      page: "Profile",
      icon: UserIcon,
    },
    {
      route: "/my-recipes",
      page: "My Recipes",
      icon: ForkKnifeIcon,
    },
    {
      route: "/dashboard",
      page: "Dashboard",
      icon: LayoutDashboard
    },
    {
      route: "/favorites",
      page: "Favorites",
      icon: Heart,
    },
  ];

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background w-40 z-50">
        {user && dropdownList.map((element) => (
          <DropdownMenuItem asChild className="w-full p-0" key={element.route}>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-4"
              onClick={() => router.push(element.route)}
            >
              <element.icon className="w-4 h-4" />
              <span>{element.page}</span>
            </Button>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild className="w-full p-0">
          {user ? (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-4 hover:border-none focus:outline-none"
              onClick={handleLogout}
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-4"
              onClick={()=> router.push("/login")}
           >
              <LogInIcon className="w-4 h-4" />
              <span>Login</span>
            </Button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropDown;
