"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

const HIDDEN_PREFIXES = [
  "/dashboard",
  "/admin",
  "/restaurant/add",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function FooterController() {
  const pathname = usePathname() || "";
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    setIsNotFound(document.body.dataset.hideFooter === "true");
  }, []);

  if (
    HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    isNotFound
  ) {
    return null;
  }

  return <Footer />;
}
