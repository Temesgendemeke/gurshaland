import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import FooterController from "@/components/FooterController";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { SatoshiFont, GoshFont } from "./fonts";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Gurshaland - Ethiopian Recipe Sharing",
  description:
    "Discover and share authentic Ethiopian recipes and culinary traditions",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${SatoshiFont.variable} ${GoshFont.variable}  min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange={false}
        >
          <Providers>
            {children}
            <FooterController />
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
