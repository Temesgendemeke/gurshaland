"use client";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

// const HIDE_ON: string[] = [
//   "/login",
//   "/signin",
//   "/register",
//   "/signup",
//   "/dashboard",
//   "/categories/",
// ];

export default function FooterController() {
  const pathname = usePathname() || "";

  if (pathname !== "/") return null;

  return <Footer />;
}
