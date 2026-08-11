"use client";
import { getProfileByID } from "@/actions/profile/getProfile";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/DashboardBreadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useProfile from "@/store/Profile";
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setProfile = useProfile((store) => store.setProfile);
  const user = useAuth((store) => store.user);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    (async () => {
      const data = await getProfileByID(user.id);
      if (!cancelled) setProfile(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, setProfile]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center  border-b border-border/50 bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
          </div>
          <DashboardBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 md:p-6 md:pt-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
