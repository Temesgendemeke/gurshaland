"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Star,
  Search,
  User,
  Plus,
  Menu,
  Sparkles,
  CookingPot,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase-client";
import { logout } from "@/actions/auth";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import ShareRecipeButton from "./ShareRecipeButton";
import AccountDropDown from "./AccountDropDown";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import CreateAPost from "./CreateAPost";
import Logo from "./Logo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuth((state) => state.user);

  const navigations = [
    {
      route: "/recipes",
      page: "Recipes",
    },
    {
      route: "/categories",
      page: "Categories",
    },
    {
      route: "/blog",
      page: "Blog",
    },
  ];

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm sticky top-0 z-50">
      <div className=" mx-auto flex items-center justify-between px-6 py-4">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden 2xl:flex  items-center space-x-8">
          {navigations.map((navigation, index) => (
            <Link
              key={index}
              href={navigation.route}
              className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
            >
              {navigation.page}
            </Link>
          ))}
          <Link
            href="/ai-features"
            className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Features</span>
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden 2xl:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search recipes..."
              className="pl-10 w-64 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white dark:bg-slate-800"
            />
          </div>

          <CreateAPost />

          <ThemeToggle />
          <AccountDropDown user={user} />
        </div>

        {/* Mobile Menu */}
        <div className="2xl:hidden">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <AccountDropDown user={user} />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 p-4 2xl:hidden">
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Search recipes..."
              className="border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white dark:bg-slate-800"
            />
            {navigations.map((navigation, index) => (
              <Link
                key={index}
                href={navigation.route}
                className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
              >
                {navigation.page}
              </Link>
            ))}
            <Link
              href="/ai-features"
              className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium flex items-center space-x-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Features</span>
            </Link>
            <CreateAPost
              align="start"
              cls="w-[var(--radix-dropdown-menu-trigger-width)]"
            />
          </div>
        </div>
      )}
    </header>
  );
}
