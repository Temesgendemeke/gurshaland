"use client";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

const HIDE_ON: string[] = ["/login", "/signin", "/register", "/signup", "/dashboard"];

export default function FooterController() {
  const pathname = usePathname() || "";

  const shouldHide = HIDE_ON.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;

  return <Footer />;
}
