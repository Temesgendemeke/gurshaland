"use client";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

const HIDDEN_PREFIXES = ["/dashboard", "/admin"];

export default function FooterController() {
  const pathname = usePathname() || "";

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return <Footer />;
}
