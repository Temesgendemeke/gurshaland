import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { Toaster } from "@/components/ui/sonner";
import SyncAuth from "@/components/SyncAuth";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gurshaland - Ethiopian Recipe Sharing",
  description:
    "Discover and share authentic Ethiopian recipes and culinary traditions",
  icons: {
    icon: "gurshaland.png",
  },
};

// className={inter.className}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SyncAuth>{children}</SyncAuth>

          <AIChatWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
