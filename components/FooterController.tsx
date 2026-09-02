"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

const HIDDEN_PREFIXES = [
  "/admin",
  "/restaurant/add",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/meal-planner/my-meal-plans",
  "/recipes/create",
  "/blog/create",
  "/ai-features/generate-recipe",
  "/settings",
];

export default function FooterController() {
  const pathname = usePathname() || "";
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const checkHide = () => {
      setShouldHide(document.body.dataset.hideFooter === "true");
    };
    checkHide();
    window.addEventListener("resize", checkHide);
    return () => window.removeEventListener("resize", checkHide);
  }, []);

  if (
    HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    shouldHide
  ) {
    return null;
  }

  return <Footer />;
}
