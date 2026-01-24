"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Menu, Sparkles } from "lucide-react";
import { useState } from "react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/store/useAuth";
import AccountDropDown from "./AccountDropDown";
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
    {
      route: "/restaurant",
      page: "Discover Restaurants",
    },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm sticky top-0 z-50 rounded-lg p-2">
      <div className="mx-auto flex items-center justify-between px-6 py-3">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden 2xl:flex  items-center space-x-8">
          {navigations.map((navigation, index) => (
            <Link
              key={index}
              href={navigation.route}
              className="text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {navigation.page}
            </Link>
          ))}
          <Link
            href="/ai-features"
            className="text-muted-foreground hover:text-primary font-medium flex items-center space-x-1 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Features</span>
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden 2xl:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search recipes..."
              className="pl-10 w-64 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div>

          <CreateAPost />

          <ThemeSwitcher />
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
        <div className="bg-background/95 backdrop-blur-xl border-t border-border p-4 2xl:hidden">
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Search recipes..."
              className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background"
            />
            {navigations.map((navigation, index) => (
              <Link
                key={index}
                href={navigation.route}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                {navigation.page}
              </Link>
            ))}
            <Link
              href="/ai-features"
              className="text-muted-foreground hover:text-primary font-medium flex items-center space-x-1 transition-colors"
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
