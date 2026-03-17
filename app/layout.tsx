import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import FooterController from "@/components/FooterController";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { Toaster } from "@/components/ui/sonner";
import SyncAuth from "@/components/SyncAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "./providers";
import { InstrumentSansFont, GoshFont } from "./fonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gurshaland - Ethiopian Recipe Sharing",
  description:
    "Discover and share authentic Ethiopian recipes and culinary traditions",
  icons: {
    icon: "/gurshaland.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${InstrumentSansFont.variable} ${GoshFont.variable} min-h-screen flex flex-col`}
      >
        <div className="grain-overlay">
          <svg
            className="grain-svg"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.7"
                numOctaves="3"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="mono"
              />
              <feComponentTransfer in="mono" result="grainAlpha">
                <feFuncA type="gamma" amplitude="1" exponent="1.4" offset="0" />
              </feComponentTransfer>
              <feComposite in="SourceGraphic" in2="grainAlpha" operator="in" />
            </filter>

            <rect
              className="grain-rect"
              width="100%"
              height="100%"
              filter="url(#grain)"
            />
          </svg>
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Providers>
            <main className="flex-1">{children}</main>
            <FooterController />
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
