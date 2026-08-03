// app/providers.tsx
"use client";

import { AIChatWidget } from "@/components/ai-chat-widget";
import SyncAuth from "@/components/SyncAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <SyncAuth>{children}</SyncAuth>
      <AIChatWidget />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}